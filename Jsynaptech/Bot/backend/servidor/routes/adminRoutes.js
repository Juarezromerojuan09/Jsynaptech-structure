import express from 'express';
import {
  createTenant,
  getTenants,
  addWhatsAppIntegration
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas en este archivo requieren autenticación y rol de 'superadmin'
const superAdminRoute = [authenticate, authorize(['superadmin'])];

// Rutas para gestionar tenants
router.post('/tenants', superAdminRoute, createTenant);
router.get('/tenants', superAdminRoute, getTenants);

// Ruta para configurar la integración de WhatsApp de un tenant
router.post('/tenants/:tenantId/integration/whatsapp', superAdminRoute, addWhatsAppIntegration);

export default router;
