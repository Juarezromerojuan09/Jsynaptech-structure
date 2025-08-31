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

    console.log('Buscando usuario:', username);
    const user = await User.findOne({ username });
    console.log('Usuario encontrado:', user ? 'Sí' : 'No', user ? { id: user._id, role: user.role } : null);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log('Comparando contraseñas...');
    const valid = await bcrypt.compare(password, user.password);
    console.log('Contraseña válida:', valid);

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
    console.error('Error en login:', err);
    res.status(500).json({ error: err.message });
  }
};