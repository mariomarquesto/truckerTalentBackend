const { AppDataSource } = require("../config/data-source");

const userRepo = AppDataSource.getRepository("User");

const saveJobForUser = async (user_email, job) => {
  const user = await userRepo.findOne({
    where: { email: user_email },
    relations: ["savedJobs"]
  });

  if (!user) throw new Error("Usuario no encontrado");

  const alreadySaved = user.savedJobs?.some(j => j.id === job.id);
  if (alreadySaved) return { message: "Ya está guardado", job };

  user.savedJobs.push(job);
  return await userRepo.save(user);
};

const getSavedJobsByUser = async (user_email) => {
  const user = await userRepo.findOne({
    where: { email: user_email },
    relations: ["savedJobs"]
  });

  if (!user) throw new Error("Usuario no encontrado");

  return user.savedJobs;
};

const removeSavedJob = async (user_email, job_id) => {
  const user = await userRepo.findOne({
    where: { email: user_email },
    relations: ["savedJobs"]
  });

  if (!user) throw new Error("Usuario no encontrado");

  user.savedJobs = user.savedJobs.filter(job => job.id !== job_id);
  return await userRepo.save(user);
};

module.exports = {
  saveJobForUser,
  getSavedJobsByUser,
  removeSavedJob
};
