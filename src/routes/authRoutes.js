// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Importa tus controladores de autenticación aquí
// const authController = require('../controllers/authController');

// Importa tus middlewares si son necesarios
const { authMiddleware } = require('../middleware/authMiddleware'); // Ruta a tu authMiddleware (singular)

// --- Rutas de Autenticación ---

/**
 * @route GET /api/auth/status
 * @desc Ruta de prueba para verificar que las rutas de autenticación funcionan.
 * @access Public
 */
router.get('/status', (req, res) => {
    res.status(200).json({ message: "Auth routes are working!" });
});

/**
 * @route POST /api/auth/register
 * @desc Ruta para registrar un nuevo usuario.
 * @access Public
 */
router.post('/register', (req, res) => {
    // Aquí iría la lógica de registro de usuario
    // authController.registerUser(req, res);
    res.status(200).json({ message: "Register endpoint, implement me!" });
});

/**
 * @route POST /api/auth/login
 * @desc Ruta para iniciar sesión.
 * @access Public
 */
router.post('/login', (req, res) => {
    // Aquí iría la lógica de inicio de sesión
    // authController.loginUser(req, res);
    res.status(200).json({ message: "Login endpoint, implement me!" });
});

/**
 * @route GET /api/auth/profile
 * @desc Ruta para obtener el perfil del usuario autenticado.
 * @access Private (requiere autenticación)
 */
router.get('/profile', authMiddleware, (req, res) => {
    // Aquí iría la lógica para obtener el perfil del usuario
    res.status(200).json({ message: `Welcome to your profile, ${req.user.username || 'user'}!`, user: req.user });
});


module.exports = router;