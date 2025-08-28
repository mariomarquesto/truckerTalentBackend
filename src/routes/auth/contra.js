
"use strict"
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const public_url = process.env.public_url;

router.get("/", (req, res) => {
  res.render("contra");
});

router.post("/", async (req, res)=>{
    await console.log(req.body)
    const token = await tokenSign(user, '15m')
    const link = `${public_url}/reset/${token}`
      const email = {
          from: "atencionalcliente@gmail.com",
          to: req.body.email,
          subject: "Mensaje recuperacion de Contraseña",
          html: `<h1> Recupera tu Contraseña </h1> 
          <p>a href="${link}"> Haz click en el link para recuperar la Contraseña.</p> 
          
          `,
        };
      
        const transport = nodemailer.createTransport({
          host: process.env.HOST,
          port: process.env.PORT,
          auth: {
            user: process.env.USERTRAP,
            pass: process.env.PASS,
          },
        });
    transport.sendMail(email);
    res.render("index", {
      message: "mensaje enviado",
    });
  })
  module.exports = router;