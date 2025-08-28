const { body } = require("express-validator");

const validLocations = ["Texas", "California", "Florida"];
const validModalities = ["On-Site", "Remote", "Hybrid"];
const validCategories = [
  "Truck Driver",
  "Dispatch",
  "Fleet Manager",
  "Warehouse Operator",
  "Logistics Coordinator",
  "Freight Broker",
  "Safety Supervisor",
  "Route Planner",
];
const validDaytimes = ["Part-Time", "Full-Time", "Night Shift"];
const validExperiences = ["Entry", "Mid", "Senior", "Expert"];

const jobValidationRules = [
  body("title")
    .notEmpty()
    .withMessage("Title is required."),

  body("company")
    .notEmpty()
    .withMessage("Company is required.")
    .isNumeric()
    .withMessage("Company should be a numeric ID."),

  body("description")
    .notEmpty()
    .withMessage("Description is required."),

  body("salary")
    .optional()
    .isNumeric()
    .withMessage("Salary should be a numeric value."),

  // Location: string or array of strings; must be one or more of the validLocations
  body("location")
    .optional()
    .custom(value => {
      if (typeof value === "string") {
        if (!validLocations.includes(value)) {
          throw new Error(`Location must be one of: ${validLocations.join(", ")}`);
        }
        return true;
      }
      if (Array.isArray(value)) {
        if (value.every(loc => validLocations.includes(loc))) {
          return true;
        }
        throw new Error(`All locations must be one of: ${validLocations.join(", ")}`);
      }
      throw new Error("Location should be a string or an array of strings.");
    }),

  // Modality: string or array of strings; must be one or more of validModalities
  body("modality")
    .optional()
    .custom(value => {
      if (typeof value === "string") {
        if (!validModalities.includes(value)) {
          throw new Error(`Modality must be one of: ${validModalities.join(", ")}`);
        }
        return true;
      }
      if (Array.isArray(value)) {
        if (value.every(mod => validModalities.includes(mod))) {
          return true;
        }
        throw new Error(`All modalities must be one of: ${validModalities.join(", ")}`);
      }
      throw new Error("Modality should be a string or an array of valid strings.");
    }),

  // Daytime: string; must be one of validDaytimes
  body("daytime")
    .optional()
    .isString()
    .withMessage("Daytime should be a string.")
    .bail()
    .custom(value => {
      if (!validDaytimes.includes(value)) {
        throw new Error(`Daytime must be one of: ${validDaytimes.join(", ")}`);
      }
      return true;
    }),

  // Skills: optional array of strings
  body("skills")
    .optional()
    .isArray()
    .withMessage("Skills must be an array."),
  body("skills.*")
    .optional()
    .isString()
    .withMessage("Each skill must be a string."),

  // Category: string or array of strings; must be one or more of validCategories
  body("category")
    .optional()
    .custom(value => {
      if (typeof value === "string") {
        if (!validCategories.includes(value)) {
          throw new Error(`Category must be one of: ${validCategories.join(", ")}`);
        }
        return true;
      }
      if (Array.isArray(value)) {
        if (value.every(cat => validCategories.includes(cat))) {
          return true;
        }
        throw new Error(`All categories must be one of: ${validCategories.join(", ")}`);
      }
      throw new Error("Category should be a string or an array of strings.");
    }),

  // Experience: optional enum value
  body("experience")
    .optional()
    .isIn(validExperiences)
    .withMessage(`Experience should be one of: ${validExperiences.join(", ")}`),
];

module.exports = jobValidationRules;