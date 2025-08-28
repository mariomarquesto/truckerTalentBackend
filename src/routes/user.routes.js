const express = require('express');
const router = express.Router();
const userController = require("../controllers/user.controller");
const authenticateToken = require('../middleware/authenticationToken');


router.get("/", userController.getAllUsers);

// Perfil
router.get('/info', userController.getUserInfo);
router.get('/personal-info', userController.getContactInfo);
router.put('/update', userController.updateProfile);
router.put('/update-photo', authenticateToken, userController.updatePhoto);

module.exports = router;