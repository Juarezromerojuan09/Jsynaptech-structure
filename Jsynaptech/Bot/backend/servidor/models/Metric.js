import mongoose from 'mongoose';

const metricSchema = new mongoose.Schema({
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tenant', 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  messages: {
    sent: { type: Number, default: 0 },
    received: { type: Number, default: 0 },
    failed: { type: Number, default: 0 }
  },
  conversations: {
    new: { type: Number, default: 0 },
    resolved: { type: Number, default: 0 }
  }
}, { timestamps: true });

export default mongoose.model('Metric', metricSchema);
