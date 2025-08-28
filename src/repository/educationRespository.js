const { AppDataSource } = require("../config/data-source");
const Experience = require("../entities/ExperienceEntity");
const Education = AppDataSource.getRepository("Education");
const userRepo = require("./userRepository");

const getByUserEmail = async (email) => {
    const user = await userRepo.findByEmail(email);
    if (!user) return [];
    return await Education.find({ where: {user: {id: user.id }}});
};

const createEducation = async (email, educationData) => {
    const user = await userRepo.findByEmail(email);
    if(!user) return null;
    const education = Education.create({ ...educationData, user });
    return await Education.save(education);
};

const updateEducation = async (id, updateEducation) => {
    const existing = await Education.findOne({ where: {id} })
    if (!existing) return null
    Education.merge(existing, updateEducation);
    return await Education.save(existing);
};

const deleteById = async (id) => {
    return await Education.delete({id});
};

const deleteAllByUserId = async (userId) => {
    await Education.delete({ user: { id: userId } });
};

const saveMany = async (educationArray) => {
    return await Education.save(educationArray);
}

module.exports = {
    getByUserEmail,
    createEducation,
    updateEducation,
    deleteById,
    deleteAllByUserId,
    saveMany
};
