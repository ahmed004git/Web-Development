import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Lead name is required'],
  },
  email: {
    type: String,
    required: [true, 'Lead email is required'],
  },
  phone: {
    type: String,
    required: [true, 'Lead phone number is required'],
  },
  propertyInterest: {
    type: String,
    required: [true, 'Property interest is required'],
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
  },
  status: {
    type: String,
    enum: ['New', 'Contacted', 'Interested', 'Closed', 'Cancelled'],
    default: 'New',
  },
  notes: {
    type: String,
    default: '',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  score: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Low',
  },
  followUpDate: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Scoring logic middleware
LeadSchema.pre('save', function (next) {
  if (this.budget > 20000000) { // 20M
    this.score = 'High';
  } else if (this.budget >= 10000000) { // 10M - 20M
    this.score = 'Medium';
  } else {
    this.score = 'Low';
  }
  next();
});

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
