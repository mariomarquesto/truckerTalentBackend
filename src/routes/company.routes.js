const express = require("express");
const router = express.Router();
const companyController = require("../controllers/company.controller");

router.post("/register", companyController.register);
router.get("/", companyController.getCompany)

module.exports = router;
