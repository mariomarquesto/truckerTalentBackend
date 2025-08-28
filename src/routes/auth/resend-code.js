const express = require("express");
const router = express.Router();
const normalizeEmail = require("../../util/normalizeEmail");
const { AppDataSource } = require("../../config/data-source");
const registerService = require("../../services/register.service");

router.post("/", async (req, res) => {
    const { email } = req.body;
    const normalizedMail = normalizeEmail(email);

    if (!normalizedMail) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const userRepo = AppDataSource.getRepository("User");
        const user = await userRepo.findOneBy({ email: normalizedMail });

        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        if (user.email_verified) {
        return res.status(400).json({ message: "Email already verified" });
        }

        await registerService.sendVerificationCode(normalizedMail);
        return res.status(200).json({ message: "New code sent. Check your email." });

    } catch (error) {
        console.error("Error resending code:", error);
        return res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;
