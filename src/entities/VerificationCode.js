const { EntitySchema } = require("typeorm");

const VerificationCode = new EntitySchema({
  name: "VerificationCode",
  tableName: "verification_codes",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    email: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    code: {
      type: "varchar",
      length: 6, // Para un código de 6 dígitos
      nullable: false,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    expiresAt: {
      type: "timestamp",
      nullable: false,
    },
  },
});

module.exports = { VerificationCode };