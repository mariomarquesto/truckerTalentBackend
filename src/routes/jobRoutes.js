// src/routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
// const { authMiddleware } = require('../middleware/authMiddleware'); // Si necesitas protección de ruta

// Ruta para crear una nueva oferta laboral
// Podrías añadir un middleware de autenticación aquí para asegurar que solo compañías creen ofertas
router.post('/', /* authMiddleware, */ jobController.createJob);

// Ruta para obtener una oferta laboral por su ID
router.get('/:id', jobController.getJobById);

// Puedes añadir más rutas para actualizar, eliminar, listar todas las ofertas, etc.
// router.put('/:id', authMiddleware, jobController.updateJob);
// router.delete('/:id', authMiddleware, jobController.deleteJob);
// router.get('/', jobController.getAllJobs); // Para listar todas las ofertas (con paginación, filtros)

module.exports = router;
