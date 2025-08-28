const { AppDataSource } = require("../config/data-source");
const userEntity = require("../entities/UserEntity");
const userRepository = AppDataSource.getRepository(userEntity);

const registerUser = async (userData) => {
  const user = userRepository.create(userData);
  return await userRepository.save(user);
};

const signInUser = async (userData) => {
  const { email } = userData;
  return await userRepository.findOne({ where: { email } });
};

const findById = async (id) => {
  return await userRepository.findOne({ where: { id } });
};

const findAllUsers = async () => {
  return await userRepository.find({
    select: ["id", "name", "surname", "email", "photo"],
    relations: ["savedJobs"],
    order: { name: "ASC" }
  });
};

const findByEmail = async (email) => {
  return await userRepository.findOneBy({ email });
};

const findProfileByEmail = async (email) => {
  return await userRepository.findOne({
    select: ["name", "surname", "email", "photo"],
    where: { email }
  });
};

const findContactInfo = async (id) => {
  return await userRepository.findOne({
    select: [
      "id", "name", "surname", "city", "email", "zipCode",
      "photo", "position", "state", "phone", "aboutMe"
    ],
    where: { id }
  });
};

const updateUserProfile = async (email, updates) => {
  const user = await findByEmail(email);
  if (!user) return null;

  userRepository.merge(user, updates);
  return await userRepository.save(user);
};

const updateUserPhoto = async (email, newPhotoUrl) => {
  const user = await findByEmail(email);
  if (!user) return null;

  user.photo = newPhotoUrl;
  return await userRepository.save(user);
};

const getInfoByEmail = async (email) => {
  return await userRepository.findOne({
    select: [
      "name", "surname", "city", "email", "zipCode",
      "photo", "phone", "position", "state"
    ],
    where: { email }
  });
};

const getInfoExperienceByEmail = async (id) => {
  return await AppDataSource
    .getRepository("Experience")
    .find({ where: { user: { id } } });
};

const getInfoEducationByEmail = async (id) => {
  return await AppDataSource
    .getRepository("Education")
    .find({ where: { user: { id } } });
};

module.exports = {
    registerUser,
    signInUser,
    findAllUsers,
    findByEmail,
    findProfileByEmail,
    findContactInfo,
    getInfoByEmail,
    updateUserProfile,
    getInfoExperienceByEmail,
    getInfoEducationByEmail,
    updateUserPhoto
};