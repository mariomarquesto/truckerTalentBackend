const express = require("express");
const createFileRoutes = require("./fileRoutes");
module.exports = createFileRoutes({ folder: "resumes", column: "resume" });
