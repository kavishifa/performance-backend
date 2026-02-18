const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  period: {
    type: String,
    required: true, // e.g., "Q1-2024", "2024-01"
  },
  metrics: {
    productivity: {
      type: Number,
      min: 0,
      max: 100,
    },
    quality: {
      type: Number,
      min: 0,
      max: 100,
    },
    teamwork: {
      type: Number,
      min: 0,
      max: 100,
    },
    communication: {
      type: Number,
      min: 0,
      max: 100,
    },
    innovation: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  achievements: [String],
  areasForImprovement: [String],
  goals: [String],
  feedback: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Performance', performanceSchema);
