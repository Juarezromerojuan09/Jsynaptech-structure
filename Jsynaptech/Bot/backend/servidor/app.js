import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import integrationRoutes from './routes/integrationRoutes.js';
import { handleVerify as handleVerifyWhatsApp, handleIncoming as handleIncomingWhatsApp } from './webhooks/whatsappWebhook.js';

const app = express();

// CORS config: abierto por defecto en dev, fácilmente restringible por FRONTEND_URL (CSV)
const parseOrigins = (origins) => {
  if (!origins) return true; // permitir todos en dev si no está definida
  if (origins === '*') return true;
  return origins.split(',').map(o => o.trim());
};

const allowedOrigins = parseOrigins(process.env.FRONTEND_URL);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/integrations', integrationRoutes);

// Aliases directos para compatibilidad con Facebook: /webhook
app.get('/webhook', handleVerifyWhatsApp);
app.post('/webhook', handleIncomingWhatsApp);

// Health check
app.get('/api/health', (req, res) => {
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  const dbStateCode = mongoose.connection?.readyState ?? 0;
  const dbState = stateMap[dbStateCode] || 'unknown';

  res.status(200).json({
    status: 'ok',
    db: {
      state: dbState,
      code: dbStateCode
    },
    env: {
      hasMongodbUri: Boolean(process.env.MONGODB_URI),
      hasJwtSecret: Boolean(process.env.JWT_SECRET)
    }
  });
});

// Socket.IO setup
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  socket.on('join_conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`Cliente ${socket.id} unido a conversación ${conversationId}`);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Export both app and io for testing
export { app, io };
export default httpServer;