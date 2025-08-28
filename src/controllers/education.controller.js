const educationService = require("../services/education.service");

exports.getEducation = async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ message: "ID requerido." });
  }

  try {
    const studies = await educationService.getEducationByUser(id);
    res.status(200).json(studies);
  } catch (error) {
    console.error("Error al obtener educación:", error);
    res.status(500).json({ message: "Error al obtener educación." });
  }
};

exports.createEducation = async (req, res) => {
  const { id, education } = req.body;
  if (!id || !education) {
    return res.status(400).json({ message: "ID y datos educativos son requeridos." });
  }

  try {
    const newStudy = await educationService.createEducation(id, education);
    res.status(201).json(newStudy);
  } catch (error) {
    console.error("Error al crear educación:", error);
    res.status(500).json({ message: "Error al crear educación." });
  }
};

exports.updateEducation = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updated = await educationService.updateEducationById(id, updates);
    if (!updated) {
      return res.status(404).json({ message: "Formación no encontrada." });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error al actualizar educación:", error);
    res.status(500).json({ message: "Error al actualizar educación." });
  }
};

exports.deleteEducation = async (req, res) => {
  const { id } = req.params;

  try {
    await educationService.deleteEducationById(id);
    res.status(200).json({ message: "Formación eliminada correctamente." });
  } catch (error) {
    console.error("Error al eliminar educación:", error);
    res.status(500).json({ message: "Error al eliminar educación." });
  }
};

exports.replaceEducations = async (req, res) => {
  const { id, education } = req.body;

  if (!id || !Array.isArray(education)) {
    return res.status(400).json({ message: "ID y educación requeridos." });
  }

  try {
    await educationService.replaceEducationsForUser(id, education);
    res.status(200).json({ message: "Educación actualizada correctamente." });
  } catch (error) {
    console.error("Error al reemplazar educación:", error);
    res.status(500).json({ message: "Error en el servidor." });
  }
};
