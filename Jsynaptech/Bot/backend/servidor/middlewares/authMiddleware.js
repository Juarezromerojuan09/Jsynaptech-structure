import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No autorizado: token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // { userId, role, ... }
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'No autorizado: token inválido o expirado' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Error en la autenticación' });
  }
};

export default authMiddleware;
