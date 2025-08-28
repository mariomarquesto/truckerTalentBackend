// Analizar y adaptar correctamente a la nueva estructura del Backend
const express = require("express");
const router = express.Router();
require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const mdlUsers = require("../../entities/UserEntity");
const registerUsers = require("../../repository/registerRepository");
const sendVerificationEmail = require("../../util/sendVerificationEmail");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Ruta para manejar el login de Google One Tap
router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    // Verificamos token con Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const firstName = payload.given_name;
    const lastName = payload.family_name;
    const photo = payload.picture;
    const password = 'google_oauth';
    console.log("Payload Ticket: ", payload);

    if (!email) {
      return res.status(400).json({ error: "Email no proporcionado por Google" });
    }

    // Buscar usuario en base de datos
    let user = await mdlUsers.getUser(email);

    // Si el usuario no existe, lo registramos
    if (!user) {
      await registerUsers.addUserGoogle(firstName, lastName, email, password, photo);
      const code = generateCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await pool.query(`
        UPDATE users
        SET email_verification_code = $1,
            verification_expires_at = $2
        WHERE email = $3
      `, [code, expiresAt, email]);

      await sendVerificationEmail(email, code);

      return res.status(200).json({
        message: "Account created by Google. Verify your email to complete your register.",
        email: email,
      });
    }

    // Si ya existe pero no está verificado
    if (!user.email_verified) {
      return res.status(403).json({ message: "Debes verificar tu email antes de continuar.",
      email: user.email 
      });
    }

    // Usuario ya verificado: generar y devolver token
    const jwtPayload = {
      id: user.id,
      email: user.email
    };

    const JWTtoken = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({
      JWTtoken,
      email: user.email,
      firstName: user.name,
      lastName: user.surname,
      photo: user.photo,
    });

  } catch (error) {
    console.error("Error en la autenticación con Google One Tap:", error);
    res.status(400).json({ error: "Token de Google inválido" });
  }
});

module.exports = router;