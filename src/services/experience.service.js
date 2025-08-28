const experienceRepo = require("../repository/experience.repository");

// Obtener experiencias por email de usuario
exports.getExperiencesByUser = async (id) => {
    return await experienceRepo.getByUserId(id);
};

// Crear una nueva experiencia para un usuario
exports.createExperience = async (id, experienceData) => {
    return await experienceRepo.createOne(id, experienceData);
};

// Actualizar una experiencia existente por ID
exports.updateExperienceById = async (id, updatedFields) => {
    return await experienceRepo.updateById(id, updatedFields);
};

// Eliminar una experiencia por ID
exports.deleteExperienceById = async (id) => {
    return await experienceRepo.deleteById(id);
};

// Reemplazar todas las experiencias para un usuario (PUT masivo)
exports.replaceExperiencesForUser = async (email, newExperienceList) => {
    return await experienceRepo.replaceAllForUser(email, newExperienceList);
};
