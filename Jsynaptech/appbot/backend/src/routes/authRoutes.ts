import { Router } from 'express';
import { login, register, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Ruta para login
router.post('/login', login);

// Ruta para registro (opcional en este proyecto pero útil)
router.post('/register', register);

// Ruta protegida para obtener perfil del usuario
router.get('/profile', authenticateToken, getProfile);

export default router;