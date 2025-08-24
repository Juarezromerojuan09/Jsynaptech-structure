import mongoose from 'mongoose';

const whatsAppIntegrationSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  businessAccountId: { type: String, required: true },
  phoneNumberId: { type: String, required: true },
  accessToken: { type: String, required: true }, // Considerar cifrado
  status: { 
    type: String, 
    enum: ['connected', 'disconnected', 'error'], 
    default: 'disconnected' 
  },
}, { timestamps: true });

export default mongoose.model('WhatsAppIntegration', whatsAppIntegrationSchema);
