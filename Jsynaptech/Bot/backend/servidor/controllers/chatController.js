import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import WhatsAppIntegration from '../models/WhatsAppIntegration.js';
import { io } from '../app.js';
import { sendWhatsAppMessage } from '../services/whatsappService.js';

// Esta función es para webhooks entrantes y debe ser manejada de forma diferente en un entorno multi-tenant.
// La identificación del tenant se hará en el webhook principal, no aquí.
export const receiveMessage = async (req, res) => {
  try {
    // La lógica actual puede ser útil para pruebas, pero no es segura para producción multi-tenant sin un mecanismo de identificación de tenant.
    const { conversationId, text, sender, tenantId } = req.body; // Se esperaría un tenantId para asociar el mensaje
    
    if (!tenantId) {
        return res.status(400).json({ error: 'tenantId es requerido para recibir mensajes' });
    }

    const message = new Message({ conversationId, sender, text, tenantId });
    await message.save();

    await Conversation.findByIdAndUpdate(conversationId, { lastMessageAt: new Date() });

    io.to(conversationId.toString()).emit('new_message', message);

    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const { _id: tenantId } = req.tenant;

    if (!conversationId || !text) {
      return res.status(400).json({ error: 'conversationId y text son requeridos' });
    }

    const conversation = await Conversation.findOne({ _id: conversationId, tenantId });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    const message = new Message({
      tenantId,
      conversationId,
      sender: 'human',
      text
    });
    await message.save();

    if (conversation.mode === 'human') {
      const integration = await WhatsAppIntegration.findOne({ tenantId });
      if (!integration || !integration.accessToken || !integration.phoneNumberId) {
        console.error(`Faltan credenciales de WhatsApp para el tenant: ${tenantId}`);
        // Opcional: notificar al usuario que la integración no está completa
        return res.status(500).json({ error: 'La integración de WhatsApp no está configurada correctamente.' });
      }

      await sendWhatsAppMessage(
        conversation.customerNumber, 
        text, 
        integration.accessToken, 
        integration.phoneNumberId
      );
    }

    conversation.lastMessageAt = new Date();
    await conversation.save();

    io.to(conversationId.toString()).emit('new_message', message);

    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { _id: tenantId } = req.tenant;
    const { conversationId } = req.params;

    // Primero, verificar que la conversación pertenece al tenant
    const conversation = await Conversation.findOne({ _id: conversationId, tenantId });
    if (!conversation) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    const messages = await Message.find({ conversationId, tenantId }).sort('timestamp');
    
    res.status(200).json({ conversation, messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Alias para ruta RESTful de mensajes
export const getConversationMessages = getConversation;

// Listar conversaciones (mínimo viable)
export const listConversations = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const { _id: tenantId } = req.tenant;

    const query = { tenantId };
    if (status) query.status = status;

    const conversations = await Conversation.find(query)
      .sort({ lastMessageAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Conversation.countDocuments(query);

    res.status(200).json({
      data: conversations,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cambiar modo de conversación (bot/human)
export const updateMode = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { mode } = req.body;
    const { _id: tenantId } = req.tenant;

    if (!['bot', 'human'].includes(mode)) {
      return res.status(400).json({ error: 'Modo inválido' });
    }

    const conversation = await Conversation.findOneAndUpdate(
      { _id: conversationId, tenantId },
      { mode },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    io.to(conversationId.toString()).emit('conversation_updated', conversation);

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};