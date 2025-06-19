import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  codeforcesHandle: {
    type: String,
    required: true
  },
  contestId: {
    type: Number,
    required: true
  },
  contestName: {
    type: String,
    required: true
  },
  handle: String,
  rank: {
    type: Number,
    required: true
  },
  oldRating: {
    type: Number,
    required: true
  },
  newRating: {
    type: Number,
    required: true
  },
  ratingChange: {
    type: Number,
    required: true
  },
  ratingUpdateTime: {
    type: Date,
    required: true
  },
  contestTime: {
    type: Date,
    required: true
  },
  problemsSolved: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicates
contestSchema.index({ studentId: 1, contestId: 1 }, { unique: true });
contestSchema.index({ codeforcesHandle: 1, contestId: 1 });
contestSchema.index({ contestTime: -1 });

export default mongoose.model('Contest', contestSchema);