const { body } = require("express-validator");
const express = require("express");
const router = express.Router();
const jobController = require("../controllers/job.controller");
const jobValidationRules = require("../middleware/jobValidationRules");

router.get("/", jobController.getAllJobs);
router.post("/", jobValidationRules, jobController.createJob);
router.get("/filtered", jobController.getFilteredJobs);
router.post("/save", jobController.saveToFavorites);
router.get("/saved/:email", jobController.getSavedJobs);
router.delete("/unsave", jobController.unsaveJob);

module.exports = router;