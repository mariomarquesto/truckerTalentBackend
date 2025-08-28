const { EntitySchema } = require("typeorm");

const Company = new EntitySchema({
  name: "Company",
  tableName: "accounts",
  schema: "companies",
  columns: {
    id: { type: Number, primary: true, generated: true },
    email: { type: String, length: 150, unique: true },
    password: { type: String, nullable: false },
    email_verified: { type: Boolean, default: true },
    created_at: { type: "timestamp", createDate: true },
    updated_at: { type: "timestamp", updateDate: true }
  },
  relations: {
  jobs: {
    type: "one-to-many",
    target: "Job",
    inverseSide: "companyAccount"
  }
}

});

module.exports = Company;