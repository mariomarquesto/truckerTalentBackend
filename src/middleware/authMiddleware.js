const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Busca el token en el encabezado 'Authorization'
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: "No se proporcionó un token." });
    }

    // Extrae el token de la cabecera "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Formato de token no válido." });
    }

    try {
        // Verifica el token
        const secret = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jwt.verify(token, secret);

        // Adjunta los datos del usuario a la petición para su uso posterior
        req.user = decoded; // Asegúrate de que `decoded` contenga el `userId` y `role`
        next();
    } catch (error) {
        // Si el token no es válido, responde con un 401
        return res.status(401).json({ message: "Token no válido o expirado." });
    }
};

// --- Nueva función de middleware para verificar si el usuario es moderador ---
const isModerator = (req, res, next) => {
    // Asume que `req.user` se ha adjuntado correctamente por `authMiddleware`
    if (!req.user) {
        return res.status(401).json({ message: "No autenticado." });
    }

    // Aquí, `req.user.role` debería ser el rol del usuario desde el token JWT.
    // Necesitas asegurarte de que tu token JWT incluya el rol del usuario cuando se crea.
    if (req.user.role === 'moderator' || req.user.role === 'admin') {
        next(); // El usuario es un moderador o admin, permite el acceso
    } else {
        return res.status(403).json({ message: "Acceso denegado: Se requiere rol de moderador/administrador." });
    }
};

module.exports = { authMiddleware, isModerator };