# Tareas de Desarrollo: Frontend (React, Vite & Tailwind)
**Módulo:** Frontend SPA  
**Revisión:** Tech Lead

---

## 📌 Configuración Base y Estado Global
- [ ] **Tarea 0.1:** Configurar cliente HTTP `Axios` con interceptores:
  - Inyección automática del header `Authorization: Bearer <token>`.
  - Captura de errores `401 Unauthorized` para llamar a `/api/auth/refresh` y reintentar la petición original (ADR-001).
- [ ] **Tarea 0.2:** Crear `AuthContext` (React Context) para manejar usuario autenticado, tokens en `localStorage` y estado de login.
- [ ] **Tarea 0.3:** Configurar React Router con rutas públicas (`/login`, `/register`) y rutas protegidas (`/`, `/profile`, `/chat`).

---

## 📌 HU01 & HU02: Módulo de Autenticación
- [ ] **Tarea 1.1:** Maquetar pantalla de Registro (`/register`) con validación de formularios y feedback de errores.
- [ ] **Tarea 1.2:** Maquetar pantalla de Login (`/login`) con manejo de carga y guardado de sesión.
- [ ] **Tarea 1.3:** Conectar con `POST /api/auth/register` y `POST /api/auth/login`.

---

## 📌 HU03: Perfil de Usuario
- [ ] **Tarea 3.1:** Crear vista de perfil (`/profile/:username`): encabezado con avatar, estadísticas de seguidores/seguidos y lista de posts propios.
- [ ] **Tarea 3.2:** Crear modal/formulario de edición de perfil (`PUT /api/users/profile`) permitiendo cambiar foto (integrado con subida HU06) y biografía.

---

## 📌 HU04 & HU05: Interacciones y Sugerencias
- [ ] **Tarea 4.1:** Implementar componente de botón `Follow / Unfollow` con actualización optimista de la UI.
- [ ] **Tarea 5.1:** Crear widget lateral de **"Sugerencias de Amistad"** consumiendo `GET /api/users/suggestions`.
- [ ] **Tarea 5.2:** Mostrar amigos en común y botón rápido para seguir desde el widget.

---

## 📌 HU06 & HU07: Publicaciones y Multimedia
- [ ] **Tarea 6.1:** Crear componente `FileUpload` con selector de archivos (imágenes/videos) y barra de progreso.
- [ ] **Tarea 6.2:** Integrar flujo de subida de 2 pasos: primero `POST /api/media/upload`, luego adjuntar la `fileUrl` al crear el post.
- [ ] **Tarea 7.1:** Crear tarjeta de creación de publicación (textarea, preview de imagen adjunta y botón de publicar).
- [ ] **Tarea 7.2:** Conectar con `POST /api/posts` y refrescar el feed inmediatamente.

---

## 📌 HU08 & HU09: Feed Timeline y Reacciones
- [ ] **Tarea 8.1:** Maquetar el Feed principal (`/`) con scroll infinito o paginación consumiendo `GET /api/feed?page=...&pageSize=...`.
- [ ] **Tarea 8.2:** Crear componente de tarjeta de post (`PostCard`) con renderizado de autor, fecha formateada, contenido y multimedia.
- [ ] **Tarea 9.1:** Crear selector de reacciones (`Like`, `Love`, `Celebrate`) con animación y conteo en tiempo real (`POST /api/posts/{id}/react`).

---

## 📌 HU10: Chat en Tiempo Real vía WebSockets
- [ ] **Tarea 10.1:** Crear hook personalizado `useWebSocketChat` para gestionar conexión, reconexión automática y recepción de eventos WS (`NEW_MESSAGE`, `TYPING`).
- [ ] **Tarea 10.2:** Maquetar vista de Chat (`/chat`) con lista de conversaciones a la izquierda y ventana de mensajes a la derecha.
- [ ] **Tarea 10.3:** Consumir historial inicial vía `GET /api/chat/{userId}/history`.
- [ ] **Tarea 10.4:** Enviar mensajes mediante frame WS `SEND_MESSAGE` e indicador de escritura `TYPING`.

---

## 📌 HU11: Notificaciones Web Push
- [ ] **Tarea 11.1:** Registrar el `service-worker.js` en la inicialización de la SPA.
- [ ] **Tarea 11.2:** Crear componente / banner de solicitud de permisos de notificación.
- [ ] **Tarea 11.3:** Obtener clave pública desde `GET /api/notifications/vapid-public-key` y suscribir el navegador enviando credenciales a `POST /api/notifications/subscribe`.
