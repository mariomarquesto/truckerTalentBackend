const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require('express-validator');

const registerService = require("../../services/register.service");
const userService = require("../../services/user.service"); // Asegúrate de que esta ruta sea correcta
const { sendVerificationEmail } = require("../../services/emailService"); // ¡Importa tu servicio de email!
const { AppDataSource } = require("../../config/data-source"); // Necesario para guardar el código
const { VerificationCode } = require("../../entities/VerificationCode"); // Tu nueva entidad para códigos

// Obtener repositorios de TypeORM
const verificationCodeRepository = AppDataSource.getRepository(VerificationCode);

// --- Ruta de registro principal (paso 0 o inicial) ---
router.post("/",
    [
        body("firstName").notEmpty().withMessage("El nombre es obligatorio"),
        body("lastName").notEmpty().withMessage("El apellido es obligatorio"),
        body("email").isEmail().withMessage("Email no válido"),
        body("pass").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, email, pass } = req.body;
        console.log("Request Body at Register:", req.body);

        try {
            const existingUser = await userService.findByEmail(email);
            if (existingUser) {
                // Si el usuario ya existe pero no está verificado, podrías reenviar el código
                if (!existingUser.email_verified) {
                    // Lógica para reenviar código si el email no está verificado
                    const verificationCode = await sendVerificationEmail(
                        email,
                        'Verificación de Cuenta - TruckerTalent',
                        'Registro de Usuario'
                    );

                    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
                    const newVerification = verificationCodeRepository.create({
                        userId: existingUser.id, // Usa el ID del usuario existente
                        code: verificationCode,
                        purpose: 'signup',
                        email: email,
                        expiresAt,
                    });
                    await verificationCodeRepository.save(newVerification);

                    return res.status(202).json({
                        message: "El usuario ya existe pero no está verificado. Se ha reenviado un código a tu email."
                    });
                }
                return res.status(400).json({ message: "Email ya utilizado." });
            }

            // Registrar el usuario con el servicio (asumiendo que maneja hashing y guardado)
            const newUser = await registerService.registerWithEmail({
                name: firstName,
                surname: lastName,
                email,
                password: pass,
                email_verified: false, // Por defecto no verificado, esperamos el código
            });

            if (!newUser) {
                return res.status(500).json({ message: "Error al registrar el usuario." });
            }

            // Generar y enviar el código de verificación
            const verificationCode = await sendVerificationEmail(
                email,
                'Verificación de Cuenta - TruckerTalent',
                'Registro de Usuario'
            );

            // Guardar el código de verificación en la base de datos
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Código válido por 15 minutos
            const newVerification = verificationCodeRepository.create({
                userId: newUser.id,
                code: verificationCode,
                purpose: 'signup',
                email: email,
                expiresAt,
            });
            await verificationCodeRepository.save(newVerification);

            // Generar token (podría ser un token para el "primer paso" o solo un token de registro)
            const registrationToken = jwt.sign(
                { email: newUser.email, id: newUser.id }, // Incluye el ID del usuario
                process.env.JWT_SECRET,
                { expiresIn: "15m" } // Token de corta duración para el registro
            );

            return res.status(201).json({
                message: "Usuario registrado. Se ha enviado un código de verificación a tu email.",
                userId: newUser.id,
                registrationToken: registrationToken,
            });

        } catch (error) {
            console.error("Error en el registro:", error);
            res.status(500).json({ message: "Error interno del servidor." });
        }
    }
);

// --- Ruta para verificar el código de registro ---
router.post("/verify-email", async (req, res) => {
    const { userId, code } = req.body; // userId podría venir del token o del cuerpo de la petición

    try {
        const user = await userService.findById(userId); // Asumiendo que userService tiene findById
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        if (user.email_verified) {
            return res.status(400).json({ message: 'El email ya está verificado.' });
        }

        const storedVerification = await verificationCodeRepository.findOne({
            where: {
                userId: userId,
                purpose: 'signup',
                isUsed: false,
                email: user.email,
            },
            order: { createdAt: 'DESC' } // Obtener el código más reciente
        });

        if (!storedVerification || storedVerification.code !== code) {
            return res.status(400).json({ message: 'Código de verificación inválido.' });
        }
        if (new Date() > storedVerification.expiresAt) {
            return res.status(400).json({ message: 'El código de verificación ha expirado.' });
        }

        // Marcar código como usado y actualizar el estado del usuario
        storedVerification.isUsed = true;
        await verificationCodeRepository.save(storedVerification);

        user.email_verified = true; // Asumiendo que tienes un campo `email_verified` en tu entidad User
        await userService.save(user); // Asumiendo que userService tiene un método save

        const finalToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" } // Token de sesión más largo
        );

        res.status(200).json({
            message: "Email verificado exitosamente. Registro completo.",
            user: { id: user.id, username: user.username, email: user.email }, // Ajusta los campos según lo que quieras devolver
            token: finalToken,
        });

    } catch (error) {
        console.error("Error durante la verificación de email:", error);
        res.status(500).json({ message: "Error interno del servidor al verificar el email." });
    }
});


// --- Ruta para completar el primer paso (ubicación) ---
router.post("/firststep", async (req, res) => {
    console.log("firststep request received");
    const { token, ubication, state , zipCode } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        console.log("Decoded email on First Step:", email);

        const data = await registerService.completeFirstStep({
            city: ubication,
            state,
            zipCode,
            email // El email es clave para encontrar al usuario en el servicio
        });

        if (data) {
            res.sendStatus(200);
        } else {
            res.status(400).json({ message: "No se pudo actualizar el usuario" });
        }
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expirado" });
        }
        console.error("❌ Error al verificar token en First Step:", err);
        return res.status(400).json({ message: "Token inválido" });
    }
});

// --- Ruta para completar el segundo paso (información laboral) ---
router.post("/secondstep", async (req, res) => {
    try {
        console.log("secondstep request received");
        const { token, salary, paymentPeriod, position } = req.body; // El email no viene directamente en el body, se decodifica del token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email; // Obtener el email del token
        
        const data = await registerService.completeSecondStep({
            salary,
            paymentPeriod,
            position,
            email // Pasa el email obtenido del token al servicio
        });

        if (data) {
            res.sendStatus(200);
        } else {
            res.status(400).json({ message: "No se pudo actualizar el usuario" });
        }
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expirado" });
        }
        console.error("❌ Error al verificar token en Second Step:", err);
        return res.status(400).json({ message: "Token inválido" });
    }
});

module.exports = router;