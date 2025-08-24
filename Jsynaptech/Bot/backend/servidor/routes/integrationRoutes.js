import express from 'express';
import {
  initiateWhatsAppAuth,
  handleWhatsAppCallback
} from '../controllers/integrationController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { setTenant } from '../middlewares/tenant.js';

const router = express.Router();

// Ruta para que un admin de un tenant inicie la conexión de su cuenta de WhatsApp.
// Requiere autenticación, rol de 'admin' y la identificación del tenant.
router.get(
  '/whatsapp/initiate',
  [authenticate, authorize(['admin']), setTenant],
  initiateWhatsAppAuth
);

// Ruta de callback que Meta usará para devolver el código de autorización.
// Es pública, pero se valida con el parámetro 'state'.
router.get('/whatsapp/callback', handleWhatsAppCallback);

export default router;
