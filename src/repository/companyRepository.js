const { AppDataSource } = require("../config/data-source");
const CompanyEntity = require("../entities/companyEntity");
const companyRepository = AppDataSource.getRepository(CompanyEntity);

const companyGet = async () => {
  return await companyRepository.find({ relations: ["jobs"]});

}

const findByEmail = async (email) => {
  return await companyRepository.findOneBy({ email: email.toLowerCase().trim() });
};

const createCompanyAccount = async (email, hashedPassword) => {
  const newCompany = companyRepository.create({
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    email_verified: true // Hasta poder realizar la verificación vía Google Oauth correctamente
  });

  return await companyRepository.save(newCompany);
};

module.exports = {
  findByEmail,
  createCompanyAccount,
  companyGet,
};
