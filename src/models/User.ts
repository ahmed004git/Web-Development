import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Enter your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Enter your email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Enter your password'],
    select: false,
  },
  role: {
    type: String,
    enum: ['Admin', 'Agent'],
    default: 'Agent',
  },
  status: {
    type: String,
    enum: ['Active', 'Suspended', 'Pending'],
    default: 'Active',
  },
  avatar: {
    type: String,
    default: '',
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
