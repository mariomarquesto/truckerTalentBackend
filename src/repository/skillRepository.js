const { AppDataSource } = require("../config/data-source");

const Skill = AppDataSource.getRepository("Skill");
const userRepo = require("./userRepository");

const getByUserId = async (userId) => {
  return await Skill.find({
    where: { user: { id: userId } },
    relations: ["user"]
  });
};

const createSkill = async (userId, skillArray = []) => {
  const user = await userRepo.findById(userId);
  if (!user) return null;

  const newSkills = skillArray.map((text) =>
    Skill.create({ skill: text, user })
  );

  return await Skill.save(newSkills);
};

const updateSkill = async (id, updatedSkill) => {
  const updates = Array.isArray(updatedSkill) ? updatedSkill : [{ id, ...updatedSkill }];
  const results = [];

  for (const item of updates) {
    const { id: itemId, ...fields } = item;
    const skill = await Skill.findOne({ where: { id: itemId } });
    if (skill) {
      Skill.merge(skill, fields);
      const saved = await Skill.save(skill);
      results.push(saved);
    }
  }

  return results.length ? results : null;
};

const deleteById = async (id) => {
  return await Skill.delete({ id });
};

module.exports = {
  getByUserId,
  createSkill,
  updateSkill,
  deleteById
};
