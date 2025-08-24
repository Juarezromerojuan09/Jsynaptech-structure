import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tenant', 
    required: true 
  },
  plan: { 
    type: String, 
    enum: ['free', 'basic', 'premium', 'enterprise'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'canceled', 'past_due', 'unpaid'], 
    default: 'active' 
  },
  currentPeriodStart: { type: Date, required: true },
  currentPeriodEnd: { type: Date, required: true },
  stripeSubscriptionId: String,
  stripeCustomerId: String,
}, { timestamps: true });

export default mongoose.model('Subscription', subscriptionSchema);
