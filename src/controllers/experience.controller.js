const experienceService = require("../services/experience.service");

// Obtener todas las experiencias por usuario
exports.getExperiences = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ message: "El correo es requerido." });
  }

  try {
    const experiences = await experienceService.getExperiencesByUser(id);
    res.status(200).json(experiences);
  } catch (error) {
    console.error("Error al obtener experiencias:", error);
    res.status(500).json({ message: "Error al obtener experiencias." });
  }
};

// Crear una experiencia
exports.createExperience = async (req, res) => {
  const { id, experience } = req.body;
  if (!id || !experience) {
    return res.status(400).json({ message: "Correo y experiencia son requeridos." });
  }

  try {
    const created = await experienceService.createExperience(id, experience);
    res.status(201).json(created);
  } catch (error) {
    console.error("Error al crear experiencia:", error);
    res.status(500).json({ message: "Error al crear experiencia." });
  }
};

// Actualizar una experiencia por ID
exports.updateExperience = async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  try {
    const updated = await experienceService.updateExperienceById(id, updatedFields);
    if (!updated) {
      return res.status(404).json({ message: "Experiencia no encontrada." });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error al actualizar experiencia:", error);
    res.status(500).json({ message: "Error al actualizar experiencia." });
  }
};

// Eliminar una experiencia por ID
exports.deleteExperience = async (req, res) => {
  const { id } = req.params;

  try {
    await experienceService.deleteExperienceById(id);
    res.status(200).json({ message: "Experiencia eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar experiencia:", error);
    res.status(500).json({ message: "Error al eliminar experiencia." });
  }
};

// Reemplazar todas las experiencias para un usuario
exports.replaceExperiences = async (req, res) => {
  const { id, experiences } = req.body;
  if (!id || !Array.isArray(experiences)) {
    return res.status(400).json({ message: "Id y experiencias son requeridos." });
  }

  try {
    await experienceService.replaceExperiencesForUser(id, experiences);
    res.status(200).json({ message: "Experiencias actualizadas correctamente." });
  } catch (error) {
    console.error("Error al reemplazar experiencias:", error);
    res.status(500).json({ message: "Error al reemplazar experiencias." });
  }
};
