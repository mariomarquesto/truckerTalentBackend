// src/entities/skillEntity.js
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
    name: "Skill",
    tableName: "skills",
    schema: "public",
    columns: {
        id: {
        primary: true,
        type: "uuid",
        generated: "uuid"
        },
        skill: {
        type: "varchar",
        nullable: false
        }
    },
    relations: {
        user: {
        type: "many-to-one",
        target: "User",
        joinColumn: true,
        onDelete: "CASCADE"
        }
    }
});
