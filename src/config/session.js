const session = require("express-session");

module.exports = session({
    secret: process.env.SESSION_SECRET || 'dev-secret',
    resave: true,
    saveUninitialized: true,
}); // ¡Exporta solo el middleware de sesión!
