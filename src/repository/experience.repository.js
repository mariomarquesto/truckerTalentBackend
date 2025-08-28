const { AppDataSource } = require("../config/data-source");
const Experience = AppDataSource.getRepository("Experience");
const userRepo = require("./userRepository"); // para acceder a findByEmail()

// Obtener todas las experiencias por email del usuario
const getByUserId = async (id) => {
    const user = await userRepo.findById(id);
    if (!user) return [];
    return await Experience.find({ where: { user: { id: user.id } } });
};

// Crear una nueva experiencia para un usuario
const createOne = async (id, experienceData) => {
    const user = await userRepo.findById(id);
    if (!user) return null;
    const experience = Experience.create({ ...experienceData, user });
    return await Experience.save(experience);
};

// Actualizar una experiencia existente por ID
const updateById = async (id, updatedFields) => {
    const existing = await Experience.findOne({ where: { id } });
    if (!existing) return null;
    Experience.merge(existing, updatedFields);
    return await Experience.save(existing);
};

// Eliminar una experiencia por ID
const deleteById = async (id) => {
    return await Experience.delete({ id });
};

// Reemplazar todas las experiencias de un usuario
const replaceAllForUser = async (id, experiences = []) => {
    const user = await userRepo.findById(id);
    if (!user) return null;

    await Experience
        .createQueryBuilder()
        .delete()
        .where("userId = :userId", { userId: user.id })
        .execute();

    const newExperiences = experiences.map(exp => ({
        ...exp,
        user
    }));

    return await Experience.save(newExperiences);
};

module.exports = {
    getByUserId,
    createOne,
    updateById,
    deleteById,
    replaceAllForUser
};
