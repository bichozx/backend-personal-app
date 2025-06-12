# backend-personal-app

repositorio backend para tauras

# 🧾 Backend - Personal Management App

Este backend forma parte de una aplicación para la gestión del personal de una empresa. Permite registrar, retirar y consultar empleados, así como generar contratos, cartas y documentos en formato Word y ZIP.

## 🛠️ Tecnologías

- Node.js
- Express
- MongoDB con Mongoose
- JWT (autenticación)
- Google OAuth
- Docxtemplater y PizZip (para generación de documentos Word)
- Archiver (para generación de ZIP)
- Node-cron (para tareas automáticas)

## 📁 Estructura del proyecto

- `src/controllers/`: Lógica de negocio y controladores de rutas.
- `src/routes/`: Rutas de API.
- `src/models/`: Esquemas de Mongoose.
- `src/middlewares/`: Validaciones y protecciones.
- `src/helpers/`: Funciones utilitarias.
- `src/documents/`: Plantillas Word usadas para contratos y anexos.
- `src/outputs/`: Documentos generados por empleado (archivos `.docx` y `.zip`).
- `src/services/`: Servicios como generador de contratos y notificaciones.
- `src/dataBase/config.js`: Conexión a MongoDB.
- `src/cron-jobs/`: Tareas programadas, como notificación de vencimiento de contratos.
- `server/server.js`: Punto de entrada del servidor Express.

## 🚀 Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tuusuario/backend-personal-app.git
   cd backend-personal-app

   ```

2. Instala las dependencias:
   npm install

3. Crea un archivo .env con tus variables de entorno:  
   PORT=5000
   MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/personal-app
   JWT_SECRET=tu_clave_secreta
   GOOGLE_CLIENT_ID=tu_id_google

4. Inicia el servidor:
   npm run start

   O si estás en desarrollo:
   npx nodemon src/server/server.js

Notas
Los documentos generados se guardan en la carpeta src/outputs/ por cédula de empleado.

El backend genera automáticamente archivos .docx y .zip para contratos y retiro.

Incluye tareas automáticas que revisan contratos próximos a vencer (src/cron-jobs).
