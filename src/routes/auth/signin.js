"use strict";
const express = require("express");
const comparar = require("../../util/passSegured");
const jwt = require("jsonwebtoken");
const router = express.Router();
const mdlUsers = require("../../services/user.service");
const authenticateToken = require('../../middleware/authenticationToken');
const normalizeEmail = require("../../util/normalizeEmail");

router.get("/refreshAdmin",async (req, res) => {
const user="santiago_lucas10@hotmail.com"; 
req.session.user;
const jwtAdmin = jwt.sign({ mail: user }, process.env.JWT_SECRET, { expiresIn: '1h' });
res.status(200).json({ jwtAdmin });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy();
  }
  res.status(200).json({ message: "Sesión cerrada correctamente" });
});

router.post("/", async (req, res) => {
  try {
    console.log("Request Body at Signin: ", req.body);
    const { email, password } = req.body;

    // Pasa un objeto con mail y password:
    const user = await userService.signInUser({ email: normalizedMail, password });



    if (!user) {
      return res.status(400).json({ message: "Incorrect user" });
    }

    
    
    // if (!user.email_verified) {
    //   return res.status(403).json({ message: "You have to verify your email before to sign in" });
    // }

    const match = await comparar.compare(pass, user.password);

    if (match) {
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      req.session.user = userData;

      const token = jwt.sign(
        { id: userData.id, email: userData.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ token, jwtUser: userData });
    } else {
      return res.status(400).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Error en Sign In:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
// if (!user.email_verified) {
//   return res.status(403).json({ message: "You have to verify your email before to sign in" });
// }


router.get("/name", authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const user = await mdlUsers.getUserProfileByEmail(userEmail);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({

firstName: user.name,
lastName: user.surname,
email: user.email,
photo: user.photo,
phone: user.phone,
city: user.city,
state: user.state,
zipCode: user.zipCode,
position: user.position,

      firstName: info.name,
      lastName: info.surname,
      email: info.email,
      photo: info.photo,
      phone: info.phone,
      city: info.city,
      state: info.state,
      zipCode: info.zipCode,
      position: info.position,

    });

  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
