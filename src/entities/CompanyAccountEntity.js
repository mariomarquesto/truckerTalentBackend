// src/entities/CompanyAccountEntity.js
const { EntitySchema } = require("typeorm");

const CompanyAccount = new EntitySchema({
    name: "CompanyAccount", // Nombre de la entidad en TypeORM
    tableName: "accounts",   // Nombre de la tabla en la DB
    schema: "companies",     // Esquema al que pertenece la tabla
    columns: {
        id: { 
            type: "uuid", 
            primary: true, 
            generated: "uuid" 
        },
        email: { 
            type: String, 
            length: 150, 
            unique: true, 
            nullable: false 
        },
        password: { // Almacena el hash de la contraseña
            type: String, 
            nullable: false 
        },
        email_verified: { 
            type: Boolean, 
            default: false 
        },
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
        // Relación One-to-One con la entidad Company (información de negocio de la compañía)
        company: {
            type: "one-to-one",
            target: "Company", // La entidad Company
            inverseSide: "account", // La propiedad 'account' en CompanyEntity
            cascade: true, // Si se elimina la cuenta, se elimina la empresa
            onDelete: "CASCADE"
        }
    }
});

module.exports = CompanyAccount;
