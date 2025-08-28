const { EntitySchema } = require("typeorm");

const User = new EntitySchema({
  name: "User",
  tableName: "users",
  schema: "public",
  columns: {
    id: { type: "uuid", primary: true, generated: "uuid" },
    name: { type: String, length: 100 },
    surname: { type: String, length: 100 },
    email: { type: String, length: 150, unique: true },
    email_verified: { type: Boolean, default: false },
    password: { type: "varchar", nullable: true },
    photo: { type: String, nullable: true },
    phone: { type: String, nullable: true },
    city: { type: String, nullable: true },
    state: { type: String, nullable: true },
    zipCode: { type: String, nullable: true },
    position: { type: String, nullable: true },
    salary: { type: "integer", nullable: true },
    pay_met: { type: "varchar", nullable: true },
    aboutMe: {type: String, length: 1200, nullable: true},
    email_verification_code: {
        type: "varchar",
        length: 6,
        nullable: true
      },
      verification_expires_at: {
        type: "timestamp",
        nullable: true
      },
    created_at: { type: "timestamp", createDate: true },
    updated_at: { type: "timestamp", updateDate: true }
  },
  relations: {
    savedJobs: {
      type: "many-to-many",
      target: "Job",
      joinTable: {
        name: "saved_jobs",
        joinColumn: { name: "user_email", referencedColumnName: "id" },
        inverseJoinColumn: { name: "job_id", referencedColumnName: "id" }
      },
      cascade: true
    }
  }
});

module.exports = User;
