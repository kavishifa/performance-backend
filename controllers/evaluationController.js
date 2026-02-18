const Evaluation = require('../models/Evaluation');

// Get all evaluations
exports.getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find()
      .populate('employee', 'name email department')
      .populate('evaluator', 'name email');
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get evaluations for an employee
exports.getEvaluationsByEmployee = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ employee: req.params.employeeId })
      .populate('employee', 'name email department')
      .populate('evaluator', 'name email');
    if (evaluations.length === 0) {
      return res.status(404).json({ message: 'No evaluations found for this employee' });
    }
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get evaluations by period
exports.getEvaluationsByPeriod = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ period: req.params.period })
      .populate('employee', 'name email department')
      .populate('evaluator', 'name email');
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create evaluation
exports.createEvaluation = async (req, res) => {
  // Calculate overall rating
  const competencies = req.body.competencies;
  const overallRating = competencies
    ? Math.round(
        (competencies.technical.rating + competencies.leadership.rating + 
         competencies.collaboration.rating + competencies.problemSolving.rating + 
         competencies.customerFocus.rating) / 5
      )
    : 0;

  const evaluation = new Evaluation({
    employee: req.body.employee,
    evaluator: req.body.evaluator,
    period: req.body.period,
    competencies: req.body.competencies,
    overallRating: overallRating,
    strengths: req.body.strengths,
    developmentAreas: req.body.developmentAreas,
    recommendations: req.body.recommendations,
    status: req.body.status || 'Draft',
  });

  try {
    const newEvaluation = await evaluation.save();
    res.status(201).json(newEvaluation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update evaluation
exports.updateEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    if (req.body.competencies) {
      evaluation.competencies = req.body.competencies;
      evaluation.overallRating = Math.round(
        (req.body.competencies.technical.rating + req.body.competencies.leadership.rating + 
         req.body.competencies.collaboration.rating + req.body.competencies.problemSolving.rating + 
         req.body.competencies.customerFocus.rating) / 5
      );
    }
    if (req.body.strengths) evaluation.strengths = req.body.strengths;
    if (req.body.developmentAreas) evaluation.developmentAreas = req.body.developmentAreas;
    if (req.body.recommendations) evaluation.recommendations = req.body.recommendations;
    if (req.body.status) evaluation.status = req.body.status;
    evaluation.updatedAt = Date.now();

    const updatedEvaluation = await evaluation.save();
    res.json(updatedEvaluation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete evaluation
exports.deleteEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findByIdAndDelete(req.params.id);
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }
    res.json({ message: 'Evaluation deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Submit evaluation
exports.submitEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }
    evaluation.status = 'Submitted';
    const updatedEvaluation = await evaluation.save();
    res.json(updatedEvaluation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
