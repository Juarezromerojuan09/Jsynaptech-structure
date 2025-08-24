import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const login = async (req, res) => {
  // --- DEBUGGING: Registrar el cuerpo completo de la solicitud ---
  console.log('Login request body:', req.body);
  // --- FIN DEBUGGING ---

  try {
    const { username, password } = req.body;

    // --- Validación y Depuración Adicional ---
    if (!username || !password) {
      console.error('Login attempt failed: Username or password missing.', { username: username ? 'present' : 'missing', password: password ? 'present' : 'missing' });
      return res.status(400).json({ message: 'Por favor, ingrese usuario y contraseña' });
    }
    // --- Fin de Validación ---

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({
      token,
      user: {
        username: user.username,
        role: user.role,
        botNumber: user.botNumber
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};