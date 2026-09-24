# Documento de Requisitos Técnicos (TRD)
## Especificación de Arquitectura Distribuida y Diseño de Ingeniería

---

## 1. Visión General de la Arquitectura del Sistema

El sistema implementa una arquitectura distribuida por capas donde cada componente asume una responsabilidad computacional, de persistencia o de comunicación claramente delimitada.

```
                            ┌─────────────────────────────────┐
                            │      Frontend en React (SPA)    │
                            │   (Vite + React + Web Workers)  │
                            └────┬──────────────┬─────────────┘
                                 │              │
                   HTTP/REST     │              │ WebSocket (RFC 6455)
                   (JSON / JWT)  │              │ (Chat Bidireccional)
                                 │              │
                            ┌────▼──────────────▼─────────────┐
                            │         Backend Quarkus         │
                            │  (Java 21 / Mutiny / RESTEasy)  │
                            └────┬──────────────┬─────────────┘
                                 │              │
                  Protocolo Bolt │              │ API S3 (AWS SDK v2 / HTTP)
                  (Cypher)       │              │ (Archivos Binarios)
                                 │              │
                     ┌───────────▼───┐      ┌───▼─────────────┐
                     │ Base de Datos │      │ Object Storage  │
                     │ Neo4j (Grafos)│      │  MinIO (S3)     │
                     └───────────────┘      └─────────────────┘
                             │
                             │ Protocolo Web Push (RFC 8030 / RFC 8291)
                             │ Firmado con claves VAPID
                             ▼
                     ┌───────────────┐
                     │ Servidor Push │
                     │ del Navegador │
                     │ (FCM/Mozilla) │
                     └───────┬───────┘
                             │ Entrega de Notificación
                             ▼
                     ┌───────────────┐
                     │ ServiceWorker │
                     │ (Cliente/OS)  │
                     └───────────────┘
```

---

## 2. Stack Tecnológico y Justificación Técnica

| Capa / Componente | Tecnología | Justificación y Valor en Sistemas Distribuidos |
|---|---|---|
| **Frontend** | React 18+ (Vite) | Renderizado declarativo, ciclo de vida optimizado para WebSockets nativos y registro de Service Workers para notificaciones en segundo plano. |
| **Backend** | Quarkus 3.x (Java 21) | Framework Java reactivo de alto rendimiento (basado en Vert.x/Mutiny), mínimo consumo de memoria, arranque instantáneo y soporte nativo para Neo4j. |
| **Base de Datos** | Neo4j 5.x Community | Diseñada para grafos: optimiza recorridos relacionales profundos (amigos de amigos, feed por seguimiento) sin el costo computacional de múltiples `JOIN` relacionales. |
| **Almacenamiento de Objetos** | MinIO (Compatible con S3) | Desacopla el almacenamiento de datos no estructurados de gran tamaño (imágenes, videos) para no saturar la base de datos de grafos. |
| **Motor de Tiempo Real** | WebSockets de Quarkus (`@ServerEndpoint`) | Canales TCP persistentes full-duplex con mínimo encabezado por mensaje y latencia inferior al milisegundo, eliminando el sobrecosto del polling HTTP. |
| **Servicio de Notificaciones** | Web Push API + VAPID (`web-push-java`) | Mecanismo desacoplado y asíncrono que permite enviar alertas al sistema operativo del usuario incluso con la pestaña del navegador cerrada. |
| **Contenedores y Despliegue** | Docker y Docker Compose | Garantiza la reproducibilidad exacta del entorno distribuido, gestionando redes virtuales aisladas y orden de arranque con healthchecks. |

---

## 3. Mecanismos de Comunicación Distribuida

### 3.1. REST sobre HTTP/1.1 o HTTP/2
- **Propósito:** Comunicación síncrona sin estado para operaciones CRUD, autenticación y consultas paginadas.
- **Protocolo:** Cargas útiles JSON autenticadas mediante la cabecera `Authorization: Bearer <JWT>`.

### 3.2. WebSockets (RFC 6455)
- **Propósito:** Comunicación bidireccional y persistente para la mensajería instantánea de chat.
- **Flujo de Ejecución:**
  1. El cliente inicia el handshake HTTP con cabecera `Upgrade: websocket`, adjuntando el JWT.
  2. Quarkus valida el token en el método `@OnOpen` y asocia la sesión a la tabla de usuarios conectados.
  3. El cliente emite un mensaje JSON -> El servidor persiste el nodo `:Mensaje` en Neo4j -> El servidor retransmite el mensaje a la sesión activa del destinatario.

### 3.3. Web Push y VAPID (RFC 8291 / RFC 8292 / RFC 8030)
- **Propósito:** Notificaciones asíncronas fuera de la aplicación.
- **Flujo de Ejecución:**
  1. El frontend solicita permiso de notificación, registra el Service Worker y ejecuta `pushManager.subscribe()`.
  2. El navegador obtiene una suscripción del servidor Push del fabricante (ej. Google FCM) con su clave pública `p256dh` y secreto `auth`.
  3. El frontend envía la suscripción al backend mediante `POST /api/notifications/subscribe`.
  4. Cuando un usuario publica un post, Quarkus consulta los seguidores en Neo4j: `MATCH (seguidor)-[:SIGUE]->(autor) WHERE autor.id = $id`.
  5. Quarkus firma el payload con su clave privada VAPID y realiza una petición HTTP POST al endpoint Push de cada seguidor.
  6. El servidor Push entrega la notificación al dispositivo, disparando el evento `push` en el Service Worker.

---

## 4. Arquitectura del Entorno y Docker Compose

### Topología de Servicios (`docker-compose.yml`)

1. **`neo4j`:**
   - Imagen: `neo4j:5-community`
   - Puertos: `7474:7474` (Interfaz Web), `7687:7687` (Protocolo Bolt)
   - Volúmenes: `neo4j_data:/data`, `neo4j_plugins:/plugins`
   - Variables: `NEO4J_AUTH=neo4j/secretpassword`
   - Healthcheck: Verificación de disponibilidad de Cypher vía `cypher-shell`.

2. **`minio`:**
   - Imagen: `minio/minio:latest`
   - Comando: `server /data --console-address ":9001"`
   - Puertos: `9000:9000` (API S3), `9001:9001` (Consola Web)
   - Variables: `MINIO_ROOT_USER=minioadmin`, `MINIO_ROOT_PASSWORD=minioadminpassword`
   - Volúmenes: `minio_data:/data`

3. **`backend` (Quarkus):**
   - Construcción: `./backend`
   - Dependencias: `neo4j` (saludable), `minio` (saludable)
   - Puertos: `8080:8080`
   - Variables de entorno:
     - `QUARKUS_NEO4J_URI=bolt://neo4j:7687`
     - `QUARKUS_NEO4J_AUTHENTICATION_USERNAME=neo4j`
     - `QUARKUS_NEO4J_AUTHENTICATION_PASSWORD=secretpassword`
     - `S3_ENDPOINT=http://minio:9000`
     - `S3_ACCESS_KEY=minioadmin`
     - `S3_SECRET_KEY=minioadminpassword`
     - `S3_BUCKET_NAME=social-media-assets`
     - `VAPID_PUBLIC_KEY=...`
     - `VAPID_PRIVATE_KEY=...`

4. **`frontend` (React SPA):**
   - Construcción: `./frontend`
   - Dependencias: `backend`
   - Puertos: `3000:80` (Nginx sirviendo el build estático) o `5173:5173` (Vite)
   - Variables de entorno: `VITE_API_URL=http://localhost:8080`
