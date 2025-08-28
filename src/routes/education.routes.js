const express = require("express");
const router = express.Router();
const educationController = require("../controllers/education.controller");

// Obtener todas las formaciones del usuario
router.get("/", educationController.getEducation); // ?mail=...

// Crear una nueva formación
router.post("/", educationController.createEducation);

// Actualizar una formación existente
router.put("/:id", educationController.updateEducation);
router.put("/", educationController.replaceEducations);

// Eliminar una formación
router.delete("/:id", educationController.deleteEducation);

module.exports = router;
