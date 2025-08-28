const normalizeEmail = require("../util/normalizeEmail");
const userRepo = require("../repository/userRepository");

exports.registerUser = async (userData) => {
  return await userRepo.registerUser(userData);
};

exports.getAllUsers = async () => {
  return await userRepo.findAllUsers();
};

exports.getUserInfo = async (id) => {
  // const safeEmail = normalizeEmail(email);
  const info = await userRepo.findContactInfo(id);
  const experience = await userRepo.getInfoExperienceByEmail(id);
  const education = await userRepo.getInfoEducationByEmail(id);
  const skills = await userRepo.getInfoSkillsByEmail(id);
  return { info, experience, education, skills };
};

exports.updateUserProfile = async (profile) => {
  const { email, ...updates } = profile;
  const safeEmail = normalizeEmail(email);
  return await userRepo.updateUserProfile(safeEmail, updates);
};

exports.updateUserPhoto = async (email, photoUrl) => {
  const safeEmail = normalizeEmail(email);
  return await userRepo.updateUserPhoto(safeEmail, photoUrl);
};

exports.findByEmail = async (email) => {
  const safeEmail = normalizeEmail(email);
  return await userRepo.findByEmail(safeEmail);
};

exports.getUserProfileByEmail = async (email) => {
  const safeEmail = normalizeEmail(email);
  return await userRepo.getInfoByEmail(safeEmail);
};

exports.signInUser = async (userData) => {
  const safeEmail = normalizeEmail(userData.email);
  return await userRepo.signInUser({ email: safeEmail });
};

