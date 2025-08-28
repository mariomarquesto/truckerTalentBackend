const { EntitySchema } = require("typeorm");

const Education = new EntitySchema({
    name: "Education",
    tableName: "educations",
    schema: "public",
    columns: {
        id: {
        type: "uuid",
        primary: true,
        generated: "uuid",
        },
        title: {
        type: "varchar",
        nullable: false,
        },
        institution: {
        type: "varchar",
        nullable: false,
        },
        date_init: {
        type: "date",
        },
        date_finish: {
        type: "date",
        nullable: true,
        },
        language: {
        type: "varchar",
        nullable: true,
        },
        level: {
        type: "varchar",
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

module.exports = Education;
