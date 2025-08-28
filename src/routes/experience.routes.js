const express = require("express");
const router = express.Router();
const experienceController = require("../controllers/experience.controller");

// Obtener todas las experiencias de un usuario
router.get("/", experienceController.getExperiences); // ?mail=user@mail.com

// Crear una nueva experiencia
router.post("/", experienceController.createExperience);

// Actualizar una experiencia por ID
router.put("/:id", experienceController.updateExperience);

// Eliminar una experiencia por ID
router.delete("/:id", experienceController.deleteExperience);

// Reemplazar TODAS las experiencias de un usuario
router.put("/", experienceController.replaceExperiences);

module.exports = router;
