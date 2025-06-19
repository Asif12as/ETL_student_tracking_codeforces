import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
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
  problemIndex: {
    type: String,
    required: true
  },
  problemName: {
    type: String,
    required: true
  },
  problemRating: {
    type: Number,
    default: null
  },
  problemTags: [{
    type: String
  }],
  verdict: {
    type: String,
    required: true
  },
  submissionTime: {
    type: Date,
    required: true
  },
  submissionId: {
    type: Number,
    required: true,
    unique: true
  },
  programmingLanguage: {
    type: String,
    required: true
  },
  timeConsumedMillis: {
    type: Number,
    default: 0
  },
  memoryConsumedBytes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
problemSchema.index({ studentId: 1, submissionTime: -1 });
problemSchema.index({ codeforcesHandle: 1, submissionTime: -1 });
problemSchema.index({ verdict: 1 });
problemSchema.index({ problemRating: 1 });
problemSchema.index({ submissionId: 1 }, { unique: true });

export default mongoose.model('Problem', problemSchema);