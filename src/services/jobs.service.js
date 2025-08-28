const jobRepo = require("../repository/jobRepository");
const savedRepo = require("../repository/savedJobRepository");

exports.getAllJobs = async () => {
  return await jobRepo.getAllJobs();
};

exports.getJobById = async (id) => {
  return await jobRepo.getJobById(id);
};

exports.createJob = async (jobData, companyId) => {
  if (!jobData.title || !jobData.location || !jobData.description) {
    throw new Error("Missing required fields");
  }

  const newJobs = await jobRepo.createJobs(jobData, companyId);
  return newJobs;
}

exports.saveJobForUser = async (userEmail, jobId) => {
  const job = await jobRepo.getJobById(jobId);
  return await savedRepo.saveJobForUser(userEmail, job);
};

exports.getSavedJobsByUser = async (userEmail) => {
  return await savedRepo.getSavedJobsByUser(userEmail);
};

exports.removeSavedJob = async (userEmail, jobId) => {
  return await savedRepo.removeSavedJob(userEmail, jobId);
};

exports.getFilteredJobs = async (filters) => {
  return await jobRepo.getFilteredJobs(filters);
};