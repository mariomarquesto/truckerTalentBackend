// src/entities/Content.js
const EntitySchema = require("typeorm").EntitySchema;

const Content = new EntitySchema({
    name: "Content", // Nombre de la entidad
    tableName: "contents", // Nombre de la tabla en tu base de datos (se creará si no existe con synchronize: true)
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true, // Auto-incremental
        },
        userId: {
            type: "varchar", // O el tipo de dato que uses para tus IDs de usuario (UUID, int, etc.)
            nullable: false,
        },
        contentType: {
            type: "varchar",
            length: 50, // 'text', 'image', 'video', 'job_description', etc.
            nullable: false,
        },
        content: {
            type: "text", // Guarda el texto real o la URL del archivo subido
            nullable: false,
        },
        moderationStatus: {
            type: "varchar",
            length: 50,
            default: "pending", // 'pending', 'approved', 'rejected', 'manual_review'
        },
        moderationDetails: {
            type: "jsonb", // Tipo de dato para almacenar objetos JSON en PostgreSQL
            nullable: true, // Puede ser nulo si no hay detalles de moderación aún
        },
        createdAt: {
            type: "timestamp",
            createDate: true, // TypeORM gestionará automáticamente esta fecha
        },
        updatedAt: {
            type: "timestamp",
            updateDate: true, // TypeORM gestionará automáticamente esta fecha al actualizar
        },
    },
});

module.exports = { Content };