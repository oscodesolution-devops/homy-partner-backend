import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  user_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  service_name: {
    type: String,
    required: true,
  },
  category: {
    type: [String], // Example: ['Indian', 'Mexican']
    required: true,
  },
  is_homemaker_service: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Service = mongoose.model('Service', ServiceSchema);
export default Service;
