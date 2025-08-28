const express = require("express");
const createFileRoutes = require("../fileRoutes");
module.exports = createFileRoutes({ folder: "cover_letters", column: "cover_letter" });
