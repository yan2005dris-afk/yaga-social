# ADR-001: Esquema de Autenticación Stateless con Access Token y Refresh Token

## Estado
Aceptado

## Contexto
En la especificación original (HU02), se definió la autenticación stateless basada en JSON Web Tokens (JWT). Para entornos de producción, el uso de un único token de larga duración presenta riesgos de seguridad (ventana de exposición elevada si el token es interceptado) y una mala experiencia de usuario si el token expira abruptamente durante la navegación o el uso del chat en tiempo real.

## Decisión
Adoptar un esquema de **Doble Token (Access Token + Refresh Token)**:

1. **Access Token (JWT Stateless):**
   - **Tiempo de vida (TTL):** 15 minutos.
   - **Formato:** JWT firmado con algoritmo RSA/ECDSA o HMAC-SHA256 gestionado por SmallRye JWT.
   - **Claims:** `sub` (userId), `username`, `roles`, `iat`, `exp`.
   - **Transporte:** Encabezado HTTP `Authorization: Bearer <ACCESS_TOKEN>`.

2. **Refresh Token (Rotación Segura):**
   - **Tiempo de vida (TTL):** 7 días.
   - **Formato:** Cadena opaca criptográficamente segura (UUIDv4 o hash SHA-256) persistida temporalmente asociada al nodo `:Usuario` o JWT específico para refresco.
   - **Transporte:** Retornado en el payload de login y enviado en `POST /api/auth/refresh`.

3. **Nuevo Endpoint:**
   - `POST /api/auth/refresh`
   - **Request:** `{ "refreshToken": "<TOKEN>" }`
   - **Response 200 OK:** `{ "token": "<NEW_ACCESS_TOKEN>", "refreshToken": "<NEW_OR_CURRENT_REFRESH_TOKEN>" }`
   - **Response 401 Unauthorized:** Refresh token expirado, inválido o revocado.

4. **Estrategia en Frontend (React):**
   - Interceptor de Axios que captura respuestas `401 Unauthorized`, solicita de forma transparente un nuevo Access Token vía `/api/auth/refresh` y reintenta la petición original sin cerrar la sesión del usuario.

## Consecuencias
- **Positivas:**
  - Cumplimiento de estándares OWASP de seguridad en APIs.
  - Ventana de compromiso mínima para el Access Token.
  - Sesión persistente y transparente para el usuario final.
- **Negativas / Mitigaciones:**
  - Requiere implementar el endpoint de refresco en Quarkus y el interceptor en Axios (esfuerzo de desarrollo bajo y aislado).
