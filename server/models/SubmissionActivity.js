import mongoose from 'mongoose';

const submissionActivitySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  codeforcesHandle: {
    type: String,
    required: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  acceptedCount: {
    type: Number,
    default: 0
  },
  wrongAnswerCount: {
    type: Number,
    default: 0
  },
  timeoutCount: {
    type: Number,
    default: 0
  },
  otherCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicates and optimize queries
submissionActivitySchema.index({ studentId: 1, date: 1 }, { unique: true });
submissionActivitySchema.index({ codeforcesHandle: 1, date: -1 });

export default mongoose.model('SubmissionActivity', submissionActivitySchema);