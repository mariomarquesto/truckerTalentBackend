"use strict";
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");


router.get("/", (req, res) => {
  res.render("contact");
});


router.post("/", (req, res) => {
  const emailMsg = {
    to: "atencionalcliente@gmail.com",
    from: req.body.email,
    subject: "Mensaje desde formulario de contacto",
    html: `${req.body.name} ${req.body.lastName} envia el siguiente mensaje: ${req.body.message}`,
  };

  const transport = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT,
    auth: {
      user: process.env.USERTRAP,
      pass: process.env.PASS,
    },
  });

  transport.sendMail(emailMsg);
  res.render("contact", {
    message: "mensaje enviado",
  });
});
module.exports = router;
