# Modelo de Datos en Grafo y Catálogo Cypher (Neo4j)

---

## 1. Modelo de Datos del Grafo (Entidades y Relaciones)

En Neo4j, la información se estructura mediante **Nodos** etiquetados y **Relaciones** dirigidas. Tanto los nodos como las relaciones almacenan **Propiedades** clave-valor.

```
       ┌────────────────────────────────────────────────────────┐
       │                    [:SIGUE {fecha}]                    │
       ▼                                                        │
┌──────────────┐         [:SIGUE {fecha}]        ┌──────────────┴─┐
│  :Usuario A  ├────────────────────────────────►│   :Usuario B   │
└──────┬───────┘                                 └──────┬─────────┘
       │                                                │
       │                                                │ [:PUBLICA {fecha}]
       │                                                ▼
       │           [:REACCIONA {tipo, fecha}]    ┌──────────────┐
       ├────────────────────────────────────────►│    :Post     │
       │                                         └────────────┘
       │
       │               [:ENVIA {fecha}]          ┌──────────────┐
       └────────────────────────────────────────►│   :Mensaje   │
                                                 └──────┬───────┘
                                                        │ [:DIRIGIDO_A]
                                                        ▼
                                                 ┌──────────────┐
                                                 │  :Usuario B  │
                                                 └────────────┘
```

---

## 2. Definición del Esquema de Nodos

### 2.1. `:Usuario` (Nodo de Usuario)
Representa a los usuarios registrados en la red.
- **Propiedades:**
  - `id` *(String, UUID)*: Identificador de negocio único (ej. `"usr_7f8a9b1c"`).
  - `username` *(String)*: Nombre de usuario único (ej. `"juanperez"`).
  - `email` *(String)*: Correo electrónico único.
  - `passwordHash` *(String)*: Contraseña cifrada con algoritmo BCrypt.
  - `fullName` *(String)*: Nombre completo del usuario.
  - `bio` *(String, opcional)*: Descripción biográfica del perfil.
  - `avatarUrl` *(String, opcional)*: URL en RustFS (S3) con la imagen de perfil.
  - `createdAt` *(ZonedDateTime / String ISO-8601)*: Fecha y hora de creación de la cuenta.
  - `pushEndpoint` *(String, opcional)*: Endpoint del servidor Push para el navegador del usuario.
  - `pushP256dh` *(String, opcional)*: Clave pública de cifrado del cliente Web Push.
  - `pushAuth` *(String, opcional)*: Clave secreta de autenticación del cliente Web Push.

### 2.2. `:Post` (Nodo de Publicación)
Representa el contenido compartido por los usuarios.
- **Propiedades:**
  - `id` *(String, UUID)*: Identificador único del post (ej. `"pst_12345678"`).
  - `content` *(String)*: Texto de la publicación.
  - `mediaUrl` *(String, opcional)*: URL en RustFS (S3) del archivo multimedia adjunto (no binarios).
  - `mediaType` *(String, opcional)*: Tipo MIME del archivo (ej. `"image/jpeg"`).
  - `createdAt` *(ZonedDateTime / String ISO-8601)*: Fecha y hora de creación del post.

### 2.3. `:Mensaje` (Nodo de Mensaje de Chat)
Representa los mensajes de chat 1 a 1 almacenados para persistencia e historial.
- **Propiedades:**
  - `id` *(String, UUID)*: Identificador del mensaje.
  - `content` *(String)*: Texto del mensaje.
  - `createdAt` *(ZonedDateTime / String ISO-8601)*: Fecha y hora de envío.
  - `read` *(Boolean)*: Indicador de lectura por parte del destinatario.

---

## 3. Definición del Esquema de Relaciones

| Relación | Nodo Origen | Nodo Destino | Propiedades | Descripción |
|---|---|---|---|---|
| `[:SIGUE]` | `:Usuario` | `:Usuario` | `createdAt` (ISO-8601) | Representa la acción de seguir a otro usuario. |
| `[:PUBLICA]` | `:Usuario` | `:Post` | `createdAt` (ISO-8601) | Conecta al autor con su publicación. |
| `[:REACCIONA]` | `:Usuario` | `:Post` | `tipo` (String: "LIKE", etc.), `createdAt` | Registra la reacción de un usuario a un post. |
| `[:ENVIA]` | `:Usuario` | `:Mensaje` | `createdAt` | Conecta al emisor con el mensaje enviado. |
| `[:DIRIGIDO_A]` | `:Mensaje` | `:Usuario` | - | Conecta el mensaje con el usuario receptor. |

---

## 4. Restricciones e Índices de la Base de Datos

Comandos Cypher para ejecutar en la inicialización:

```cypher
// Restricciones de unicidad y existencia
CREATE CONSTRAINT user_id_unique IF NOT EXISTS
FOR (u:Usuario) REQUIRE u.id IS UNIQUE;

CREATE CONSTRAINT user_username_unique IF NOT EXISTS
FOR (u:Usuario) REQUIRE u.username IS UNIQUE;

CREATE CONSTRAINT user_email_unique IF NOT EXISTS
FOR (u:Usuario) REQUIRE u.email IS UNIQUE;

CREATE CONSTRAINT post_id_unique IF NOT EXISTS
FOR (p:Post) REQUIRE p.id IS UNIQUE;

CREATE CONSTRAINT message_id_unique IF NOT EXISTS
FOR (m:Mensaje) REQUIRE m.id IS UNIQUE;

// Índices para optimización de recorridos del grafo
CREATE INDEX user_username_index IF NOT EXISTS
FOR (u:Usuario) ON (u.username);

CREATE INDEX post_created_at_index IF NOT EXISTS
FOR (p:Post) ON (p.createdAt);

CREATE INDEX message_created_at_index IF NOT EXISTS
FOR (m:Mensaje) ON (m.createdAt);
```

---

## 5. Catálogo de Consultas Cypher No Triviales (Requisito #7)

### Consulta 1: Generación de Feed Personalizado (Solo Usuarios Seguidos)
Obtiene las publicaciones de los usuarios a quienes sigue `$userId`, agregando métricas de reacciones.
```cypher
MATCH (me:Usuario {id: $userId})-[:SIGUE]->(author:Usuario)-[:PUBLICA]->(post:Post)
OPTIONAL MATCH (post)<-[r:REACCIONA]-(reactor:Usuario)
OPTIONAL MATCH (me)-[myReaction:REACCIONA]->(post)
RETURN post.id AS id,
       post.content AS content,
       post.mediaUrl AS mediaUrl,
       post.createdAt AS createdAt,
       author.id AS authorId,
       author.username AS authorUsername,
       author.fullName AS authorFullName,
       author.avatarUrl AS authorAvatarUrl,
       count(r) AS totalReactions,
       myReaction.tipo AS userReactionType
ORDER BY post.createdAt DESC
SKIP $skip
LIMIT $limit
```

### Consulta 2: Recomendaciones Multinivel (Amigos de Mis Seguidos / 2 Saltos)
Recomienda usuarios seguidos por las personas a quienes el usuario sigue, ordenados por número de conexiones en común, excluyendo a quienes ya sigue y a sí mismo.
```cypher
MATCH (me:Usuario {id: $userId})-[:SIGUE]->(friend:Usuario)-[:SIGUE]->(suggested:Usuario)
WHERE NOT (me)-[:SIGUE]->(suggested) AND suggested <> me
WITH suggested, count(friend) AS mutualCount, collect(friend.username) AS mutualFriends
RETURN suggested.id AS id,
       suggested.username AS username,
       suggested.fullName AS fullName,
       suggested.avatarUrl AS avatarUrl,
       suggested.bio AS bio,
       mutualCount AS recommendationScore,
       mutualFriends[0..3] AS sampleMutualConnections
ORDER BY mutualCount DESC, suggested.username ASC
LIMIT 10
```

### Consulta 3: Conexiones Mutuas (Usuarios Seguidos en Común)
Encuentra los usuarios que se siguen mutuamente tanto con el Usuario A como con el Usuario B.
```cypher
MATCH (userA:Usuario {id: $userAId})-[:SIGUE]->(common:Usuario)<-[:SIGUE]-(userB:Usuario {id: $userBId})
MATCH (userA)<-[:SIGUE]-(common)-[:SIGUE]->(userB)
RETURN common.id AS id,
       common.username AS username,
       common.fullName AS fullName,
       common.avatarUrl AS avatarUrl
```

### Consulta 4: Red Social Alcanzable (Camino Más Corto / Grado de Separación)
Calcula la ruta más corta de seguimiento entre dos usuarios para evaluar su distancia en la red.
```cypher
MATCH (source:Usuario {id: $sourceId}), (target:Usuario {id: $targetId})
MATCH path = shortestPath((source)-[:SIGUE*..5]->(target))
RETURN length(path) AS degreeOfSeparation,
       [node IN nodes(path) | node.username] AS connectionPath
```

### Consulta 5: Influencers y Centralidad en la Red Extendida
Identifica a los usuarios con mayor cantidad de seguidores dentro del radio de 2 niveles del usuario actual.
```cypher
MATCH (me:Usuario {id: $userId})-[:SIGUE*1..2]->(networkUser:Usuario)
WHERE networkUser <> me
MATCH (follower:Usuario)-[:SIGUE]->(networkUser)
RETURN networkUser.id AS id,
       networkUser.username AS username,
       networkUser.fullName AS fullName,
       count(DISTINCT follower) AS networkPopularityScore
ORDER BY networkPopularityScore DESC
LIMIT 5
```
