import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  codeforcesHandle: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  currentRating: {
    type: Number,
    default: 0
  },
  maxRating: {
    type: Number,
    default: 0
  },
  lastSubmission: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  lastEmailSent: {
    type: Date,
    default: null
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  avatar: {
    type: String,
    default: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  // Codeforces specific data
  codeforcesData: {
    rank: String,
    maxRank: String,
    contribution: Number,
    organization: String,
    country: String,
    city: String,
    lastOnlineTime: Date,
    registrationTime: Date
  },
  // Sync metadata
  lastSyncTime: {
    type: Date,
    default: null
  },
  syncStatus: {
    type: String,
    enum: ['pending', 'syncing', 'success', 'error'],
    default: 'pending'
  },
  syncError: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better performance
studentSchema.index({ codeforcesHandle: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ isActive: 1 });
studentSchema.index({ lastSubmission: -1 });

export default mongoose.model('Student', studentSchema);