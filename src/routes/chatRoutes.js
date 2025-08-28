// src/routes/chatRoutes.js
const express = require('express');
// Importa tu AppDataSource si las rutas de chat interactúan con la base de datos
const { AppDataSource } = require('../config/data-source'); 
// Importa tus entidades de chat si las tienes (ej: Message, Chat)
// const { Message } = require('../entities/Message'); 
// const { Chat } = require('../entities/Chat');

// Importa tus middlewares si son necesarios (ej. para autenticación)
const { authMiddleware } = require('../middleware/authMiddleware'); // Ruta a tu authMiddleware (singular)

const router = express.Router();

// --- Rutas de Chat ---

/**
 * @route GET /api/chat/status
 * @desc Ruta de prueba para verificar que las rutas de chat funcionan.
 * @access Public (o Private si usas authMiddleware)
 */
router.get('/status', (req, res) => {
    res.status(200).json({ message: "Chat routes are working!" });
});

// Ejemplo de ruta protegida (requiere autenticación)
router.get('/my-chats', authMiddleware, (req, res) => {
    // Lógica para obtener los chats del usuario autenticado
    res.status(200).json({ message: `Welcome ${req.user.username || 'user'}, here are your chats.` });
});


module.exports = router;
