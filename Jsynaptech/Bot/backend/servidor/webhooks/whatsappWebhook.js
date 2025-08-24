import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import WhatsAppIntegration from '../models/WhatsAppIntegration.js';
import { io } from '../app.js';

export const handleVerify = (req, res) => {
  const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token && mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
};

export const handleIncoming = async (req, res) => {
  try {
    const body = req.body;
    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const messages = value?.messages || [];

    if (!messages.length) {
      return res.sendStatus(200);
    }

    const msg = messages[0];
    const from = msg.from; // wa_id del cliente final
    const text = msg.text?.body || '';
    const phoneNumberId = value?.metadata?.phone_number_id; // ID del número de WhatsApp del tenant

    // 1. Identificar al tenant usando el phoneNumberId
    const integration = await WhatsAppIntegration.findOne({ phoneNumberId });
    if (!integration || !integration.tenantId) {
      console.error(`Webhook recibido para un número no registrado: ${phoneNumberId}`);
      return res.sendStatus(200); // Responder 200 para evitar reintentos de Meta
    }
    const { tenantId } = integration;

    // 2. Buscar o crear la conversación para ese tenant
    let conversation = await Conversation.findOne({ customerNumber: from, tenantId });
    if (!conversation) {
      conversation = await Conversation.create({
        tenantId,
        customerNumber: from,
        customerName: value?.contacts?.[0]?.profile?.name || from,
        status: 'active',
        mode: 'bot', // Por defecto, inicia en modo bot
        lastMessageAt: new Date(),
      });
    } else {
      conversation.lastMessageAt = new Date();
      await conversation.save();
    }

    // Notificar al frontend (dashboard del tenant) sobre la conversación
    io.to(tenantId.toString()).emit('conversation_upserted', conversation);

    // 3. Guardar el mensaje y asociarlo al tenant y la conversación
    const message = await Message.create({
      tenantId,
      conversationId: conversation._id,
      sender: 'customer',
      text: text || '[mensaje no textual]',
    });

    // Emitir el nuevo mensaje a la sala de la conversación específica
    io.to(String(conversation._id)).emit('new_message', message);

    return res.sendStatus(200);
  } catch (err) {
    console.error('Error procesando webhook de WhatsApp:', err.message || err);
    return res.sendStatus(200); // Siempre devolver 200 para evitar bloqueos de Meta
  }
};
