const skillService = require("../services/skill.service");

// GET /api/skills/:userId
exports.getSkills = async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: "User ID requerido." });

  try {
    const skills = await skillService.getSkillsByUserId(userId);
    res.status(200).json(skills);
  } catch (err) {
    console.error("Error to get skills:", err);
    res.status(500).json({ message: "Error from server." });
  }
};

// POST /api/skills
exports.createSkill = async (req, res) => {
  const { userId, skills } = req.body;
  if (!userId || !skills || !Array.isArray(skills)) {
    return res.status(400).json({ message: "userId y array de skills son requeridos." });
  }

  try {
    const result = await skillService.createSkillArray(userId, skills);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error al crear skills:", error);
    res.status(500).json({ message: "Error al guardar skills." });
  }
};

// PUT /api/skills/:id
exports.updateSkill = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updated = await skillService.updateSkillById(id, updatedData);
    if (!updated || updated.length === 0) {
      return res.status(404).json({ message: "Skill no encontrada." });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error al actualizar skill:", err);
    res.status(500).json({ message: "Error al actualizar skill." });
  }
};

// DELETE /api/skills/:id
exports.deleteSkill = async (req, res) => {
  const { id } = req.params;

  try {
    await skillService.deleteSkillById(id);
    res.status(200).json({ message: "Skill eliminada correctamente." });
  } catch (err) {
    console.error("Error al eliminar skill:", err);
    res.status(500).json({ message: "Error al eliminar skill." });
  }
};
