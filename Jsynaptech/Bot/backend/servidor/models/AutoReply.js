import mongoose from 'mongoose';

const autoReplySchema = new mongoose.Schema({
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tenant', 
    required: true 
  },
  name: { type: String, required: true },
  trigger: { 
    type: String, 
    enum: ['KEYWORD', 'GREETING', 'AWAY', 'OFF_HOURS'], 
    required: true 
  },
  keywords: [{ type: String }],
  response: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('AutoReply', autoReplySchema);
