const jobService = require("../services/jobs.service");
const { validationResult } = require("express-validator");

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await jobService.getAllJobs();
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ message: "Error interno" });
  }
};

exports.createJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());
    const msgs = errors.array().map(e => e.msg);
    return res.status(400).json({ errors: msgs });
  }

  try {
    const job = await jobService.createJob(req.body);
    res.status(201).json(job);
  } catch (err) {
    console.error("Error creando job:", err);
    res.status(500).json({ message: "No se pudo crear el trabajo" });
  }
};

exports.saveToFavorites = async (req, res) => {
  try {
    const { email, jobId } = req.body;
    const job = await jobService.getJobById(jobId);

    if (!job) return res.status(404).json({ message: "Trabajo no encontrado" });

    await jobService.saveJobForUser(email, jobId);
    res.status(200).json({ message: "Guardado correctamente" });
  } catch (err) {
    console.error("Error al guardar trabajo:", err);
    res.status(500).json({ message: "Error interno al guardar favorito" });
  }
};

exports.getSavedJobs = async (req, res) => {
  try {
    const { email } = req.params;
    const jobs = await jobService.getSavedJobsByUser(email);
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error interno al traer favoritos" });
  }
};

exports.unsaveJob = async (req, res) => {
  try {
    const { email, jobId } = req.body;
    await jobService.removeSavedJob(email, jobId);
    res.status(200).json({ message: "Eliminado de favoritos" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar favorito" });
  }
};

exports.getFilteredJobs = async (req, res) => {
  try {
    const jobs = await jobService.getFilteredJobs(req.query);
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error filtering jobs:", err);
    res.status(400).json({ message: err.message || "Intern error." });
  }
};
