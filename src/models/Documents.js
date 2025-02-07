import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  document_type: {
    type: String,
    required: true,
  },
  document_number: {
    type: String,
    required: true,
  },
  images: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: { createdAt: 'uploaded_at' } });

const Document = mongoose.model('Document', DocumentSchema);
export default Document;
