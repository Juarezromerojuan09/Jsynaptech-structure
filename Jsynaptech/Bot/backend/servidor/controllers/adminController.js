import Tenant from '../models/Tenant.js';
import User from '../models/User.js';
import WhatsAppIntegration from '../models/WhatsAppIntegration.js';
import bcrypt from 'bcryptjs';

// --- Gestión de Tenants ---

export const createTenant = async (req, res) => {
  const { name, email, password, companyName } = req.body;

  if (!name || !email || !password || !companyName) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios: nombre, email, contraseña y nombre de la empresa.' });
  }

  try {
    // 1. Crear el Tenant
    const newTenant = await Tenant.create({ name: companyName, status: 'active' });

    // 2. Crear el usuario Administrador para ese Tenant
    const hashedPassword = await bcrypt.hash(password, 12);
    const adminUser = await User.create({
      tenantId: newTenant._id,
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    res.status(201).json({ 
      message: 'Cliente y usuario administrador creados con éxito.', 
      tenant: newTenant,
      user: { id: adminUser._id, name: adminUser.name, email: adminUser.email }
    });

  } catch (error) {
    console.error('Error al crear el tenant:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find().sort({ createdAt: -1 });
    res.status(200).json(tenants);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los clientes.' });
  }
};

// --- Gestión de Integraciones ---

export const addWhatsAppIntegration = async (req, res) => {
  const { tenantId } = req.params;
  const { phoneNumber, phoneNumberId, wabaId, accessToken } = req.body;

  if (!phoneNumber || !phoneNumberId || !wabaId || !accessToken) {
    return res.status(400).json({ message: 'Todos los campos de integración son obligatorios.' });
  }

  try {
    const integration = await WhatsAppIntegration.findOneAndUpdate(
      { tenantId },
      { phoneNumber, phoneNumberId, wabaId, accessToken, status: 'connected' },
      { new: true, upsert: true } // Crea si no existe, actualiza si sí
    );

    res.status(201).json({ message: 'Integración de WhatsApp guardada con éxito.', integration });

  } catch (error) {
    console.error('Error al añadir la integración de WhatsApp:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
