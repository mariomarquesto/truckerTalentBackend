// src/services/jobService.js
const { getAppDataSource } = require('../config/data-source');
const { EntitySchema } = require('typeorm'); // Necesario para TypeORM

// Importa tus entidades. Asegúrate de que los nombres de archivo coincidan con la capitalización.
const Job = require('../entities/JobEntity'); // Asumiendo que tu archivo es JobEntity.js
const Company = require('../entities/companyEntity'); // Asumiendo que tu archivo es companyEntity.js

class JobService {
    constructor() {
        this.jobRepository = null;
        this.companyRepository = null;
        this.initializeRepositories();
    }

    async initializeRepositories() {
        try {
            const dataSource = await getAppDataSource();
            this.jobRepository = dataSource.getRepository(Job);
            this.companyRepository = dataSource.getRepository(Company);
        } catch (error) {
            console.error("Error al inicializar repositorios en JobService:", error);
            // Dependiendo de tu estrategia de manejo de errores, podrías relanzar, salir, etc.
            throw new Error("No se pudieron inicializar los repositorios de JobService.");
        }
    }

    /**
     * @param {Object} jobData - Datos de la oferta laboral a crear.
     * @param {string} jobData.title
     * @param {string} jobData.description
     * @param {string} [jobData.location]
     * @param {string} [jobData.city]
     * @param {string} [jobData.zipCode]
     * @param {number} [jobData.minSalary]
     * @param {number} [jobData.maxSalary]
     * @param {'Full-time'|'Part-time'|'Contract'|'Internship'|'Temporary'} jobData.jobType
     * @param {string[]} [jobData.skills]
     * @param {string} [jobData.daytime]
     * @param {string[]} [jobData.category]
     * @param {'Entry'|'Mid'|'Senior'|'Expert'} [jobData.experience]
     * @param {string} companyId - ID de la compañía que publica la oferta.
     * @returns {Promise<Job>} La nueva oferta laboral creada.
     */
    async createJob(jobData, companyId) {
        if (!this.jobRepository || !this.companyRepository) {
            await this.initializeRepositories(); // Reintentar inicializar si no están listos
        }

        const company = await this.companyRepository.findOne({ where: { id: companyId } });
        if (!company) {
            throw new Error("Compañía no encontrada.");
        }

        const newJob = this.jobRepository.create({
            ...jobData,
            company: company, // Asocia la compañía a la oferta
            postedDate: new Date(), // Establece la fecha de publicación automáticamente
            // Si expirationDate no se proporciona, podrías calcularla aquí
        });

        await this.jobRepository.save(newJob);
        return newJob;
    }

    /**
     * @param {string} jobId - ID de la oferta laboral.
     * @returns {Promise<Job|null>} La oferta laboral encontrada o null si no existe.
     */
    async getJobById(jobId) {
        if (!this.jobRepository) {
            await this.initializeRepositories();
        }
        return await this.jobRepository.findOne({
            where: { id: jobId },
            relations: ["company"] // Carga la información de la compañía asociada
        });
    }

    // Puedes añadir más métodos como updateJob, deleteJob, searchJobs, etc.
}

module.exports = new JobService(); // Exporta una instancia única del servicio
