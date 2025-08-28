const educationRepo = require("../repository/educationRespository")
const userRepo = require("../repository/userRepository");

exports.getEducationByUser = async (id) => {
  return await educationRepo.getByUserId(id);
};

exports.createEducation = async (id, educationData) => {
  return await educationRepo.createEducation(id, educationData);
};

exports.updateEducationById = async (id, updates) => {
  return await educationRepo.updateEducation(id, updates);
};

exports.deleteEducationById = async (id) => {
  return await educationRepo.deleteById(id);
};

exports.replaceEducationsForUser = async (id, educationList) => {
  const user = await userRepo.findById(id);
  if (!user) throw new Error("Usuario no encontrado.");

  await educationRepo.deleteAllByUserId(user.id);
  const formatted = educationList.map(e => ({ ...e, user }));
  return await educationRepo.saveMany(formatted);
};
