// src/middleware/auth.js
function authMiddleware(req, res, next) {
  // Ejemplo simple: puede verificar un token en headers, sesión, etc.
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No auth token provided' });

  // Aquí iría la lógica para verificar el token...
  // Si está bien:
  next();

  // Si falla:
  // return res.status(403).json({ message: 'Invalid token' });
}

module.exports = authMiddleware;
