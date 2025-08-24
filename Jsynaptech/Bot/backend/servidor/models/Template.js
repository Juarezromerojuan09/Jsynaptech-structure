import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tenant', 
    required: true 
  },
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['MARKETING', 'UTILITY', 'AUTHENTICATION'], 
    required: true 
  },
  language: { type: String, default: 'es' },
  components: [{ type: mongoose.Schema.Types.Mixed }],
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'PAUSED'], 
    default: 'PENDING' 
  },
  metaTemplateId: String,
}, { timestamps: true });

export default mongoose.model('Template', templateSchema);
