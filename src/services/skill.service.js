const skillRepo = require("../repository/skillRepository");

exports.getSkillsByUserId = async (id) => {
  return await skillRepo.getByUserId(id);
};

exports.createSkillArray = async (id, skillArray) => {
  return await skillRepo.createSkill(id, skillArray);
};

exports.updateSkillById = async (id, updatedSkill) => {
  return await skillRepo.updateSkill(id, updatedSkill);
};

exports.deleteSkillById = async (id) => {
  return await skillRepo.deleteById(id);
};
