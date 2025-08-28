const express = require("express");
const router = express.Router();
const pool = require("../db");
const sendVerificationEmail = require("../util/sendVerificationEmail");
const normalizeEmail = require("../util/normalizeEmail");
require('dotenv').config();

function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/", async (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "Valid email is required" });
    }
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const result = await pool.query(
            "SELECT email_verified FROM users WHERE email = $1",
            [normalizedEmail]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Usuario not found" });
        }

        if (result.rows[0].email_verified) {
            return res.status(400).json({ message: "This email is already verified" });
        }

        const newCode = generateCode();
        const newExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await pool.query(
            `UPDATE users
             SET email_verification_code = $1,
                 verification_expires_at = $2
             WHERE email = $3`,
            [newCode, newExpiresAt, normalizedEmail]
        );

        await sendVerificationEmail(normalizedEmail, newCode);
        return res.status(200).json({ message: "New code sent. Check your email." });

    } catch (error) {
        console.error("Error resending verification code:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;