const companyService = require("../services/company.service");

exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const newCompany = await companyService.registerCompanyAccount(email, password);
    res.status(201).json({ message: "Company registered", company: newCompany });
  } catch (error) {
    console.error("Error registering company:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getCompany = async (req, res) => {
  try {
    const company = await companyService.companyGet();
    res.status(200).json(company);
  } catch (err) {
    console.error("Error al obtener todos las company:", err);
    res.status(500).json({ error: "Error al obtener company" });
  }
};
