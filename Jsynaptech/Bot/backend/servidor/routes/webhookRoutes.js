import express from 'express';
import { handleVerify, handleIncoming } from '../webhooks/whatsappWebhook.js';

const router = express.Router();

router.get('/whatsapp', handleVerify);
router.post('/whatsapp', express.json(), handleIncoming);

export default router;
