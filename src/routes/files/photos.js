const express = require("express");
const createFileRoutes = require("../fileRoutes");
module.exports = createFileRoutes({ folder: "photos", column: "photo_profile" });