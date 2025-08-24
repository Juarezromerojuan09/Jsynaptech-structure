import express from 'express';
import {
  receiveMessage,
  sendMessage,
  getConversation,
  getConversationMessages,
  listConversations,
  updateMode
} from '../controllers/chatController.js';
import { authenticate } from '../middlewares/auth.js';
import { setTenant } from '../middlewares/tenant.js';

const router = express.Router();

// Middleware para todas las rutas protegidas en este archivo
const protectedRoute = [authenticate, setTenant];

// Webhook entrante local (si se usa) - público o protegido según necesidad
router.post('/messages', receiveMessage);

// Listar conversaciones y mensajes (protegidos)
router.get('/conversations', protectedRoute, listConversations);
router.get('/conversations/:conversationId', protectedRoute, getConversation);
router.get('/conversations/:conversationId/messages', protectedRoute, getConversationMessages);

// Enviar mensaje (humano) y cambiar modo (protegidos)
router.post('/send', protectedRoute, sendMessage);
router.patch('/conversations/:conversationId/mode', protectedRoute, updateMode);

export default router;