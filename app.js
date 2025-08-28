const express = require("express");
const path = require("path");
const morgan = require("morgan");
require("dotenv").config(); // Carga las variables de entorno

// Importamos los middlewares de configuración desde sus archivos separados
const corsMiddleware = require("./src/config/cors");
const sessionMiddleware = require("./src/config/session");

// Importamos los manejadores de errores
const { notFound, errorHandler } = require("./src/middleware/errorHandlers");

const app = express();

// 🧩 Middlewares de la aplicación
app.use(corsMiddleware); // Usa el middleware de CORS
app.use(express.json()); // Middleware para parsear cuerpos de petición JSON
app.use(express.urlencoded({ extended: true })); // Middleware para parsear cuerpos de petición URL-encoded
app.use(sessionMiddleware); // Usa el middleware de sesión
app.use(morgan("tiny")); // Middleware para logging de peticiones HTTP

// Configuración de encabezados de seguridad
app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
});

// 🛣️ Rutas de la aplicación
// Este archivo src/routes/index.js se encarga de cargar todas tus otras rutas
require("./src/routes")(app);

// 🚀 Sirve el Frontend React (construido en la carpeta client/dist)
app.use(express.static(path.resolve(__dirname, "./client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist/index.html"));
});

// 🚨 Manejo de errores global
app.use(notFound); // Middleware para manejar rutas no encontradas (404)
app.use(errorHandler); // Middleware para manejar errores generales del servidor

module.exports = app;
