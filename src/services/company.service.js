const bcrypt = require("bcrypt");
const companyRepo = require("../repository/companyRepository");

exports.registerCompanyAccount = async (email, password) => {
  const existing = await companyRepo.findByEmail(email);
  if (existing) throw new Error("Company already registered");

  const hashedPassword = await bcrypt.hash(password, 10);
  return await companyRepo.createCompanyAccount(email, hashedPassword);
};

exports.companyGet = async () => {
  return await companyRepo.companyGet()
}