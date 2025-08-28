const { EntitySchema } = require("typeorm");

const ChatMessage = new EntitySchema({
    name: "ChatMessage",
    tableName: "chat_messages",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        roomId: {
            type: "int",
            nullable: false,
        },
        senderId: {
            type: "varchar",
            nullable: false,
        },
        message: {
            type: "text",
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

module.exports = { ChatMessage };
