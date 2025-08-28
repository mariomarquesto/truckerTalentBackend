const normalizeEmail = require("../../util/normalizeEmail");
const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/", async (req, res) => {
  const { email, code } = req.body;
  console.log("Request Body:", req.body);
    const normalizedMail = normalizeEmail(email);
    const result = await pool.query(`
      SELECT email_verification_code, verification_expires_at
      FROM users
      WHERE email = $1
    `, [normalizedMail]);
  
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }
  
    const user = result.rows[0];
  
    if (user.email_verification_code !== code.trim()) {
      return res.status(400).json({ message: "Incorrect code" });
    }
  
    if (new Date() > user.verification_expires_at) {
      return res.status(410).json({ message: "The code has expired. Please, request a new one." });
    }
    
    if (!email || !code) {
      return res.status(400).json({ message: "Email and code are required" });
    }
  
    await pool.query(`
      UPDATE users
      SET email_verified = TRUE,
          email_verification_code = NULL,
          verification_expires_at = NULL
      WHERE email = $1
    `, [normalizedMail]);
  
    return res.status(200).json({ message: "Email verified correctly" });
  });
  
  module.exports = router;