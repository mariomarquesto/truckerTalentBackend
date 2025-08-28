const express = require("express");
const router = express.Router();
const mdlUsers = require("../models/mdlUsers.js");
const pool = require("../../config/data-source.js");
const { encrypt } = require("../../util/passSegured.js");
const sendPasswordResetCodeEmail = require("../../util/sendPasswordResetCodeEmail.js");
const sendPasswordChangedEmail = require("../../util/sendPasswordChangedEmail.js");

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/request", async(req, res) => {
    const { email } = req.body;

    const user= await mdlUsers.getUser(email);
    if(!user) {return res.status(404).json({ message: "There is not an account with this email."})}
    if (user.password === "google_oauth") {
    return res.status(403).json({
        message: "This account was created with Google. Please sign in with Google instead.",
    });
    }
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(`
        UPDATE users
        SET email_verification_code = $1,
        verification_expires_at = $2 WHERE email = $3
        `, [code, expiresAt, email]);

        await sendPasswordResetCodeEmail(email, code);
        res.status(200).json({ message: "The code to confirm the password change has been sent."})
})

router.post("/verify-code", async (req, res) => {
    const { email, code } = req.body;
    const result = await pool.query(`
        SELECT verification_expires_at
        FROM users
        WHERE mail = $1 AND email_verification_code = $2
    `, [email, code]);

    if(result.rowCount === 0) {
        return res.status(400).json({message: "Invalid Code"});
    }

    const { verification_expires_at } = result.rows[0];
    if (new Date() > new Date(verification_expires_at)) {
        return res.status(400).json({message: "Code has expired"});
    }

    res.status(200).json({message: "Valid Code"});
});

router.post("/reset", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const hashed = await encrypt(newPassword);

    const result = await pool.query(`
      UPDATE users
      SET password = $1,
          email_verification_code = null,
          verification_expires_at = null
      WHERE email = $2
    `, [hashed, email]);

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    await sendPasswordChangedEmail(email);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error during password reset" });
  }
});

module.exports = router;