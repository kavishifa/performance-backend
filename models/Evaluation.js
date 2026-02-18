const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  evaluator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  evaluationDate: {
    type: Date,
    default: Date.now,
  },
  period: {
    type: String,
    required: true,
  },
  competencies: {
    technical: {
      rating: { type: Number, min: 1, max: 5 },
      comments: String,
    },
    leadership: {
      rating: { type: Number, min: 1, max: 5 },
      comments: String,
    },
    collaboration: {
      rating: { type: Number, min: 1, max: 5 },
      comments: String,
    },
    problemSolving: {
      rating: { type: Number, min: 1, max: 5 },
      comments: String,
    },
    customerFocus: {
      rating: { type: Number, min: 1, max: 5 },
      comments: String,
    },
  },
  overallRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  strengths: [String],
  developmentAreas: [String],
  recommendations: String,
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Reviewed', 'Completed'],
    default: 'Draft',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Evaluation', evaluationSchema);
