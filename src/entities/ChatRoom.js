const { EntitySchema } = require("typeorm");

const ChatRoom = new EntitySchema({
    name: "ChatRoom",
    tableName: "chat_rooms",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        name: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        createdAt: {
            type: "timestamp",
            createDate: true,
        },
        updatedAt: {
            type: "timestamp",
            updateDate: true,
        },
    },
});

module.exports = { ChatRoom };
