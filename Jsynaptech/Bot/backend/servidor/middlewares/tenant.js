import Tenant from '../models/Tenant.js';

export const setTenant = async (req, res, next) => {
  try {
    if (!req.user || !req.user.tenantId) {
      return res.status(401).json({ message: 'Usuario no autorizado o sin cliente asignado' });
    }

    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    if (tenant.status !== 'active') {
      return res.status(403).json({ 
        message: 'La cuenta de su cliente está suspendida o pendiente de activación.' 
      });
    }

    req.tenant = tenant;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar la solicitud del cliente' });
  }
};
