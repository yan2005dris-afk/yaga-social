// ==============================================================================
// seed.cypher
// Semillas de Datos Iniciales para el Entorno de Desarrollo (Idempotente)
// ==============================================================================

// 1. Usuarios del Equipo YAGA
MERGE (u1:Usuario {id: "usr_yandris_01"})
ON CREATE SET 
  u1.username = "yandris",
  u1.email = "yandris@yaga.social",
  u1.fullName = "Yandris Tech",
  u1.bio = "Arquitecto de Software & Tech Lead en YAGA Social",
  u1.avatarUrl = "http://localhost:9000/social-media-assets/avatars/yandris.png",
  u1.passwordHash = "$2a$10$wN3YtK8a3d5jH9k3eP8f7u5.7H4m8K2g9T1y4M7v3Q6b5Z2x8L1eC", // Password123!
  u1.createdAt = datetime("2026-09-24T12:00:00Z");

MERGE (u2:Usuario {id: "usr_gino_02"})
ON CREATE SET 
  u2.username = "gino",
  u2.email = "gino@yaga.social",
  u2.fullName = "Gino Backend",
  u2.bio = "Especialista en Microservicios, RustFS S3 y Web Push",
  u2.avatarUrl = "http://localhost:9000/social-media-assets/avatars/gino.png",
  u2.passwordHash = "$2a$10$wN3YtK8a3d5jH9k3eP8f7u5.7H4m8K2g9T1y4M7v3Q6b5Z2x8L1eC",
  u2.createdAt = datetime("2026-09-24T12:05:00Z");

MERGE (u3:Usuario {id: "usr_andy_03"})
ON CREATE SET 
  u3.username = "andy",
  u3.email = "andy@yaga.social",
  u3.fullName = "Andy Graph",
  u3.bio = "Entusiasta de Neo4j, algoritmos de grafos y WebSockets",
  u3.avatarUrl = "http://localhost:9000/social-media-assets/avatars/andy.png",
  u3.passwordHash = "$2a$10$wN3YtK8a3d5jH9k3eP8f7u5.7H4m8K2g9T1y4M7v3Q6b5Z2x8L1eC",
  u3.createdAt = datetime("2026-09-24T12:10:00Z");

MERGE (u4:Usuario {id: "usr_allison_04"})
ON CREATE SET 
  u4.username = "allison",
  u4.email = "allison@yaga.social",
  u4.fullName = "Allison Frontend",
  u4.bio = "Desarrolladora React, Vite, Tailwind CSS y UI/UX",
  u4.avatarUrl = "http://localhost:9000/social-media-assets/avatars/allison.png",
  u4.passwordHash = "$2a$10$wN3YtK8a3d5jH9k3eP8f7u5.7H4m8K2g9T1y4M7v3Q6b5Z2x8L1eC",
  u4.createdAt = datetime("2026-09-24T12:15:00Z");

// 2. Relaciones de Seguimiento ([:SIGUE])
MERGE (u1)-[r1:SIGUE]->(u2)
ON CREATE SET r1.createdAt = datetime("2026-09-24T13:00:00Z");

MERGE (u1)-[r2:SIGUE]->(u3)
ON CREATE SET r2.createdAt = datetime("2026-09-24T13:05:00Z");

MERGE (u2)-[r3:SIGUE]->(u4)
ON CREATE SET r3.createdAt = datetime("2026-09-24T13:10:00Z");

MERGE (u3)-[r4:SIGUE]->(u4)
ON CREATE SET r4.createdAt = datetime("2026-09-24T13:15:00Z");

MERGE (u4)-[r5:SIGUE]->(u1)
ON CREATE SET r5.createdAt = datetime("2026-09-24T13:20:00Z");

// 3. Publicaciones de Prueba ([:PUBLICA])
MERGE (p1:Post {id: "pst_001"})
ON CREATE SET 
  p1.content = "¡Bienvenidos a YAGA Social! El cluster distribuido con Neo4j y RustFS está levantado.",
  p1.mediaUrl = "http://localhost:9000/social-media-assets/posts/cluster_diagram.png",
  p1.mediaType = "image/png",
  p1.createdAt = datetime("2026-09-24T14:00:00Z");

MERGE (u1)-[pub1:PUBLICA]->(p1)
ON CREATE SET pub1.createdAt = datetime("2026-09-24T14:00:00Z");

MERGE (p2:Post {id: "pst_002"})
ON CREATE SET 
  p2.content = "Probando la reactividad de Quarkus 3.x con RESTEasy Reactive y WebSockets. ¡Vuela!",
  p2.mediaUrl = null,
  p2.mediaType = null,
  p2.createdAt = datetime("2026-09-24T14:30:00Z");

MERGE (u2)-[pub2:PUBLICA]->(p2)
ON CREATE SET pub2.createdAt = datetime("2026-09-24T14:30:00Z");

// 4. Reacciones a Publicaciones ([:REACCIONA])
MERGE (u2)-[reac1:REACCIONA]->(p1)
ON CREATE SET reac1.tipo = "LIKE", reac1.createdAt = datetime("2026-09-24T14:05:00Z");

MERGE (u3)-[reac2:REACCIONA]->(p1)
ON CREATE SET reac2.tipo = "LOVE", reac2.createdAt = datetime("2026-09-24T14:10:00Z");

MERGE (u4)-[reac3:REACCIONA]->(p1)
ON CREATE SET reac3.tipo = "CELEBRATE", reac3.createdAt = datetime("2026-09-24T14:15:00Z");

MERGE (u1)-[reac4:REACCIONA]->(p2)
ON CREATE SET reac4.tipo = "LIKE", reac4.createdAt = datetime("2026-09-24T14:35:00Z");

// 5. Mensajes de Chat ([:ENVIA] y [:DIRIGIDO_A])
MERGE (m1:Mensaje {id: "msg_001"})
ON CREATE SET 
  m1.content = "¡Hola Andy! ¿Revisaste las consultas Cypher de 2 saltos para recomendaciones?",
  m1.read = true,
  m1.createdAt = datetime("2026-09-24T15:00:00Z");

MERGE (u1)-[env1:ENVIA]->(m1)
ON CREATE SET env1.createdAt = datetime("2026-09-24T15:00:00Z");

MERGE (m1)-[:DIRIGIDO_A]->(u3);

MERGE (m2:Mensaje {id: "msg_002"})
ON CREATE SET 
  m2.content = "¡Hola Yandris! Sí, están optimizadas con índices y agregaciones MATCH.",
  m2.read = true,
  m2.createdAt = datetime("2026-09-24T15:02:00Z");

MERGE (u3)-[env2:ENVIA]->(m2)
ON CREATE SET env2.createdAt = datetime("2026-09-24T15:02:00Z");

MERGE (m2)-[:DIRIGIDO_A]->(u1);
