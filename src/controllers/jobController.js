// src/controllers/jobController.js
const jobService = require('../services/jobService');

class JobController {
    /**
     * @route POST /api/jobs
     * @desc Crear una nueva oferta laboral.
     * @access Private (solo para compañías autenticadas)
     * @param {object} req - Objeto de solicitud Express.
     * @param {object} res - Objeto de respuesta Express.
     */
    async createJob(req, res) {
        try {
            // Asumiendo que el ID de la compañía viene del usuario autenticado (ej: req.user.companyId)
            // O bien, desde el cuerpo de la solicitud si se valida su pertenencia.
            // Por ahora, asumiremos que se envía en el cuerpo para la prueba.
            const { companyId, ...jobData } = req.body;

            // Validación básica de datos (puedes usar express-validator para una validación más robusta)
            if (!jobData.title || !jobData.description || !jobData.jobType || !companyId) {
                return res.status(400).json({ message: "Faltan campos obligatorios: title, description, jobType, companyId." });
            }
            if (jobData.minSalary && jobData.maxSalary && jobData.minSalary > jobData.maxSalary) {
                return res.status(400).json({ message: "El salario mínimo no puede ser mayor que el salario máximo." });
            }

            const newJob = await jobService.createJob(jobData, companyId);
            res.status(201).json(newJob);
        } catch (error) {
            console.error("Error al crear oferta laboral:", error);
            res.status(500).json({ message: error.message || "Error interno del servidor al crear oferta laboral." });
        }
    }

    /**
     * @route GET /api/jobs/:id
     * @desc Obtener una oferta laboral por su ID.
     * @access Public
     * @param {object} req - Objeto de solicitud Express.
     * @param {object} res - Objeto de respuesta Express.
     */
    async getJobById(req, res) {
        try {
            const { id } = req.params;
            const job = await jobService.getJobById(id);

            if (!job) {
                return res.status(404).json({ message: "Oferta laboral no encontrada." });
            }
            res.status(200).json(job);
        } catch (error) {
            console.error("Error al obtener oferta laboral:", error);
            res.status(500).json({ message: error.message || "Error interno del servidor al obtener oferta laboral." });
        }
    }

    // Puedes añadir más métodos como updateJob, deleteJob, getCompanyJobs, searchJobs, etc.
}

module.exports = new JobController(); // Exporta una instancia única del controlador
