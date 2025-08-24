import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  conversationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Conversation', 
    required: true 
  },
  sender: { 
    type: String, 
    enum: ['customer', 'bot', 'human'], 
    required: true 
  },
  text: { type: String, required: true },
  mediaUrl: { type: String },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);