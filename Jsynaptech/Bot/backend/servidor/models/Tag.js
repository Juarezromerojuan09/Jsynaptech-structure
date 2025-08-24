import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tenant', 
    required: true 
  },
  name: { type: String, required: true },
  color: { type: String, default: '#3B82F6' },
}, { timestamps: true });

const conversationTagSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  tagId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tag', required: true }
});

conversationTagSchema.index({ conversationId: 1, tagId: 1 }, { unique: true });

export const Tag = mongoose.model('Tag', tagSchema);
export const ConversationTag = mongoose.model('ConversationTag', conversationTagSchema);
