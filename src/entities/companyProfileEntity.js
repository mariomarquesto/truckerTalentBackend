// src/entities/CompanyProfileEntity.js
const { EntitySchema } = require("typeorm");

const CompanyProfile = new EntitySchema({
    name: "CompanyProfile", // Nombre de la entidad para el perfil detallado
    tableName: "company_profiles", // Nombre de la tabla para los perfiles de compañía
    schema: "companies",
    columns: {
        id: { 
            type: "uuid", 
            primary: true, 
            generated: "uuid" 
        },
        company_id: { // FK a CompanyEntity
            type: "uuid",
            nullable: false,
            unique: true // Asegura la relación 1:1 con Company
        },
        industry: { 
            type: String, 
            length: 100, 
            nullable: true 
        },
        size: { // Renombrado de 'employee_count' a 'size' para ser más general
            type: String, 
            length: 50, 
            nullable: true 
        }, // Ej: "1-10", "11-50", "51-200", etc.
        foundedYear: { 
            type: "integer", 
            nullable: true 
        },
        mission: { 
            type: String, 
            length: 2000, 
            nullable: true 
        },
        vision: { 
            type: String, 
            length: 2000, 
            nullable: true 
        },
        socialMediaLinks: { 
            type: "jsonb", 
            nullable: true 
        }, // Ej: { "linkedin": "url", "twitter": "url" }
        created_at: { 
            type: "timestamp", 
            createDate: true 
        },
        updated_at: { 
            type: "timestamp", 
            updateDate: true 
        }
    },
    relations: {
        // Relación One-to-One con CompanyEntity
        company: {
            type: "one-to-one",
            target: "Company", // La entidad Company
            joinColumn: {
                name: "company_id", // Columna en esta tabla que guarda el ID de la compañía
                referencedColumnName: "id"
            },
            inverseSide: "profile", // La propiedad 'profile' en CompanyEntity
            cascade: true, // Si se elimina la compañía, se elimina el perfil
            onDelete: "CASCADE"
        }
    }
});

module.exports = CompanyProfile;
