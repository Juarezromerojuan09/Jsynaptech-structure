import mongoose from 'mongoose';

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'suspended', 'pending'], 
    default: 'pending' 
  },
  // Otros campos relevantes para el cliente
}, { timestamps: true });

export default mongoose.model('Tenant', tenantSchema);
