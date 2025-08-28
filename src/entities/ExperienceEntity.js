const { EntitySchema } = require("typeorm");

const Experience = new EntitySchema({
    name: "Experience",
    tableName: "experiences",
    schema: "public",
    columns: {
        id: {
            type: "uuid",
            primary: true,
            generated: "uuid",
        },
        job: {
            type: "varchar",
            nullable: false,
        },
        company: {
            type: "varchar",
            nullable: false,
        },
        init_date: {
            type: "date",
        },
        finish_date: {
            type: "date",
            nullable: true,
        },
        description: {
            type: "text",
            nullable: true,
        },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: true,
            onDelete: "CASCADE",
        },
    },
});

module.exports = { ExperienceEntity: Experience };