// src/routes/index.js
// Este archivo centraliza la carga de todas tus rutas.

module.exports = (app) => {
    // Importa tus rutas individuales
    const authRoutes = require('./authRoutes'); // Ruta actualizada para la ubicación directa en 'src/routes/'
    const moderationRoutes = require('./moderationRoutes');
    const chatRoutes = require('./chatRoutes');
    const jobRoutes = require('./jobRoutes'); // <<-- ¡NUEVAS RUTAS DE JOB AÑADIDAS!
    // ... agrega aquí cualquier otra ruta que tengas (ej: userRoutes, productRoutes, etc.)

    // Registra cada grupo de rutas con su base path
    app.use('/api/auth', authRoutes); // Prefijo para rutas de autenticación
    app.use('/api/moderation', moderationRoutes); // Prefijo para rutas de moderación
    app.use('/api/chat', chatRoutes); // Prefijo para rutas de chat
    app.use('/api/jobs', jobRoutes); // <<-- ¡NUEVO PREFIJO PARA RUTAS DE JOB AÑADIDO!
    // ... registra aquí cualquier otra ruta ...
};
