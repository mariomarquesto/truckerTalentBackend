// src/entities/JobEntity.js
const { EntitySchema } = require("typeorm");

const Job = new EntitySchema({
    name: "Job",
    tableName: "jobs",
    schema: "companies", // Asegura que esta entidad use el esquema "companies"
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        title: {
            type: "varchar",
            length: 150,
            nullable: false,
        },
        description: { // Longitud aumentada para descripciones detalladas
            type: "varchar",
            length: 5000,
            nullable: true,
        },
        // --- Nuevas y/o corregidas propiedades para alineación con Figma ---
        location: { // Se mantiene como un campo de texto general, puedes ajustarlo si solo necesitas ciudad/código postal
            type: "varchar",
            length: 255,
            nullable: true,
        },
        city: { // Ciudad específica
            type: "varchar",
            length: 100,
            nullable: true,
        },
        zipCode: { // Código postal
            type: "varchar",
            length: 20,
            nullable: true,
        },
        minSalary: { // Salario mínimo
            type: "numeric",
            nullable: true,
        },
        maxSalary: { // Salario máximo
            type: "numeric",
            nullable: true,
        },
        jobType: { // Tipo de trabajo (Full-time, Part-time, Contrato, Pasantía, Temporal)
            type: "enum",
            enum: ["Full-time", "Part-time", "Contract", "Internship", "Temporary"],
            nullable: false, // Asumimos que el tipo de trabajo es obligatorio
            default: "Full-time"
        },
        // --- Propiedades existentes ajustadas o mantenidas ---
        skills: {
            type: "text",
            array: true,
            nullable: true,
        },
        daytime: { // Podría ser 'Diurno', 'Nocturno', 'Flexible'
            type: "varchar",
            length: 100,
            nullable: true,
        },
        category: {
            type: "text",
            array: true,
            nullable: true,
        },
        experience: {
            type: "enum",
            enum: ["Entry", "Mid", "Senior", "Expert"],
            nullable: true,
        },
        postedDate: { // Fecha de publicación de la oferta
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
        },
        expirationDate: { // Fecha de caducidad de la oferta
            type: "timestamp with time zone",
            nullable: true,
        },
        // created_at y updated_at se mantienen para control interno
        created_at: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
        },
        updated_at: {
            type: "timestamp with time zone",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
        },
    },
    relations: {
        company: {
            type: "many-to-one",
            target: "Company",
            joinColumn: {
                name: "company_id",
                referencedColumnName: "id"
            },
            nullable: false
        },
        savedByUsers: {
            type: "many-to-many",
            target: "User",
            mappedBy: "savedJobs"
        }
    }
});

module.exports = Job;