import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
  customerNumber: { type: String, required: true },
  customerName: { type: String },
  status: { 
    type: String, 
    enum: ['active', 'closed', 'pending'], 
    default: 'active' 
  },
  mode: {
    type: String,
    enum: ['bot', 'human'],
    default: 'bot'
  },
  lastMessageAt: { type: Date, default: Date.now },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);