const { AppDataSource } = require("../config/data-source");

const jobRepo = AppDataSource.getRepository("Job");
const companyRepo = AppDataSource.getRepository("Company")

const getAllJobs = async () => {
    return await jobRepo.find();
};

const getJobById = async (id) => {
    return await jobRepo.findOneBy({ id });
};

const createJob = async (jobData, companyId) => {
    const company = await companyRepo.findOneBy({ id: companyId });
    const job = jobRepo.create({ ...jobData, companyAccount: company });
    return await jobRepo.save(job);
};


const deleteJob = async (id) => {
    
};

const updateJob = async (id, updatedData) => {
    await jobRepo.update({ id }, updatedData);
    return await jobRepo.findOneBy({ id });
};

const getFilteredJobs = async (filters) => {
  console.log("⚠️ Entrando a getFilteredJobs()");
  let { location, daytime, experience, category, skills, modality, minSalary, maxSalary } = filters;

  // Validaciones de salario
  if (minSalary && maxSalary && Number(minSalary) > Number(maxSalary)) {
    throw new Error("Invalid salary range.");
  }

  minSalary = minSalary ? Number(minSalary) : null;
  maxSalary = maxSalary ? Number(maxSalary) : null;

  if (minSalary && isNaN(minSalary)) throw new Error("Invalid minSalary");
  if (maxSalary && isNaN(maxSalary)) throw new Error("Invalid maxSalary");

  const parseArray = (input) => {
    if (!input) return [];
    return Array.isArray(input) ? input : input.split(",");
  };

  const locations = parseArray(location);
  const categories = parseArray(category);
  const modalities = parseArray(modality);
  const skillsArray = parseArray(skills);

  let query = jobRepo.createQueryBuilder("job");

  if (locations.length > 0) {
    query.andWhere("job.location && :locations", { locations });
  }

  if (daytime) {
    query.andWhere("job.daytime = :daytime", { daytime });
  }

  if (experience) {
    query.andWhere("job.experience = :experience", { experience });
  }

  if (categories.length > 0) {
    query.andWhere("job.category && :categories", { categories });
  }

  if (modalities.length > 0) {
    query.andWhere("job.modality && :modalities", { modalities });
  }

  if (skillsArray.length > 0) {
    query.andWhere("job.skills && :skills", { skills: skillsArray });
  }

  if (minSalary !== null) {
    query.andWhere("job.salary >= :minSalary", { minSalary });
  }

  if (maxSalary !== null) {
    query.andWhere("job.salary <= :maxSalary", { maxSalary });
  }

  query.take(100);

  console.log("Filters:", filters);
  console.log("Generated SQL:", query.getSql());

  return query.getMany();
};

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    deleteJob,
    updateJob,
    getFilteredJobs,
};
