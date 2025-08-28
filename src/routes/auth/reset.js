"use strict"
const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const { tokenVerify } = require("../utils/handleJWT")
const {encrypt} = require("../../util/passSegured");

router.get("/:token", async (req, res) => {
    const { token } = req.params
    const tokenStatus = await tokenVerify(token)
    if (tokenStatus instanceof Error) {
        res.send(tokenStatus)
    } else res.render("reset", { tokenStatus, token })
  });
  
  router.post("/:token",[
    check("password_1", "la contraseña debe ser mayor de 8 caracteres")
        .exists()
        .notEmpty()
        .isLength({ min: 8, max: 15 })
        .trim(),
    check("password_2")
        .custom(async (password_2, { req }) => {
            const password_1 = req.body.password_1
            if (password_1 !== password_2) {
                throw new Error("las contraseñas tiene que ser identicas")
            }
        })],
    async (req, res, next) => {
        const token = req.params.token
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const arrWarnings = errors.array()
            res.render("reset", { arrWarnings, token })
        } else {
            const { token } = req.params
        const tokenStatus = await tokenVerify(token)
        if (tokenStatus instanceof Error) return res.send(tokenStatus)
        const password = await encrypt(req.body.password_1)
        const dbResponse = await editUserById(tokenStatus.id, { password })
        dbResponse instanceof Error ? next(dbResponse) : res.status(200).json({ message: `Contraseña cambiada por: ${tokenStatus.name}` })
    }

});

module.exports = router;