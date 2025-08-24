import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

dotenv.config();

async function run() {
  try {
    await connectDB();

    const [,, customerNumberArg, customerNameArg, modeArg] = process.argv;
    const customerNumber = customerNumberArg || '521234567890';
    const customerName = customerNameArg || 'Juan Pérez';
    const mode = modeArg === 'human' ? 'human' : 'human';

    // Crear conversación si no existe para ese número
    let conversation = await Conversation.findOne({ customerNumber });
    if (!conversation) {
      conversation = new Conversation({
        customerNumber,
        customerName,
        mode,
        status: 'active',
        lastMessageAt: new Date()
      });
      await conversation.save();
      console.log('Conversación creada:', conversation._id.toString());
    } else {
      console.log('Conversación ya existe:', conversation._id.toString());
    }

    // Crear mensajes de ejemplo
    const existingMsgs = await Message.findOne({ conversationId: conversation._id });
    if (!existingMsgs) {
      await Message.create([
        {
          conversationId: conversation._id,
          sender: 'customer',
          text: 'Hola, necesito ayuda',
          timestamp: new Date(Date.now() - 1000 * 60 * 5)
        },
        {
          conversationId: conversation._id,
          sender: 'bot',
          text: 'Hola, soy el bot. ¿En qué puedo ayudarte?',
          timestamp: new Date(Date.now() - 1000 * 60 * 4)
        }
      ]);
      console.log('Mensajes de ejemplo insertados');
    } else {
      console.log('La conversación ya tiene mensajes, no se insertan ejemplos');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error creando conversación:', err.message || err);
    process.exit(1);
  }
}

run();
