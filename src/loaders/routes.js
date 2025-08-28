const express = require("express");

const userRoutes = require("../routes/user.routes");
const jobRoutes = require("../routes/job.routes");
// Mantendremos "authRoutes" para "/api/signin" y "/api/auth" si es necesario.
// Si "authRoutes" solo maneja el inicio de sesión, considera renombrar el archivo y la variable a "signInRoutes" para mayor claridad.
const authRoutes = require("../routes/auth/signin"); 
const googleRoutes = require("../routes/auth/authGoogle");
const registerRoutes = require("../routes/auth/register");
const experienceRoutes = require("../routes/experience.routes");
const educationRoutes = require("../routes/education.routes");
const skillRoutes = require("../routes/skill.routes");
const companyRoutes = require("../routes/company.routes");

// --- Importa tus nuevas rutas de moderación y chat aquí ---
const moderationRoutes = require('../routes/moderationRoutes'); 
const chatRoutes = require('../routes/chatRoutes'); 
// --- Fin de importación de nuevas rutas ---


module.exports = (app) => {
    // Monta todas las rutas bajo el prefijo '/api' para estandarizar
    app.use("/api/users", userRoutes);
    
    // **Importante**: Decide si `/api/signin` y `/api/auth` deben usar la misma ruta de archivo.
    // Si `authRoutes` de `auth/signin.js` maneja AMBOS, puedes dejarlos así.
    // Si necesitas rutas de autenticación más generales, podrías tener otro archivo como `auth.routes.js`
    app.use("/api/signin", authRoutes); // Usa authRoutes para la ruta de inicio de sesión
    // app.use("/api/auth", authRoutes); // Descomenta esta línea si tu authRoutes también maneja una ruta /api/auth genérica
    
    app.use("/api/register", registerRoutes);
    app.use("/api/google", googleRoutes);
    app.use("/api/jobs", jobRoutes);
    app.use("/api/experiences", experienceRoutes);
    app.use("/api/education", educationRoutes);
    app.use("/api/skills", skillRoutes);
    app.use("/api/company", companyRoutes);

    // --- Monta tus nuevas rutas de moderación y chat ---
    app.use("/api/moderation", moderationRoutes);
    app.use("/api/chat", chatRoutes);
    // --- Fin de montaje de nuevas rutas ---
};