import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Tenant from '../models/Tenant.js';

dotenv.config();

async function run() {
  try {
    await connectDB();

    // Crear o encontrar tenant por defecto
    let tenant = await Tenant.findOne({ name: 'Default Tenant' });
    if (!tenant) {
      tenant = new Tenant({ name: 'Default Tenant', status: 'active' });
      await tenant.save();
      console.log('Tenant creado:', tenant._id);
    } else {
      console.log('Tenant existente:', tenant._id);
    }

    const [,, usernameArg, passwordArg, botNumberArg, roleArg] = process.argv;
    const username = usernameArg || 'admin';
    const password = passwordArg || 'admin123';
    const botNumber = botNumberArg || '521234567890';
    const role = roleArg || 'admin'; // 'admin' | 'agent'

    const existing = await User.findOne({ username });
    if (existing) {
      console.log(`Usuario ya existe: ${username}`);
      process.exit(0);
    }

    const user = new User({ username, password, botNumber, role, tenantId: tenant._id });
    await user.save();

    console.log('Usuario creado correctamente');
    console.log({ username: user.username, role: user.role, botNumber: user.botNumber });
    process.exit(0);
  } catch (err) {
    console.error('Error creando usuario:', err.message || err);
    process.exit(1);
  }
}

run();
