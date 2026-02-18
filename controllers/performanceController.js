const Performance = require('../models/Performance');
const Employee = require('../models/Employee');

// Get all performance records
exports.getAllPerformance = async (req, res) => {
  try {
    const performances = await Performance.find().populate('employee', 'name email department');
    res.json(performances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get performance by employee ID
exports.getPerformanceByEmployee = async (req, res) => {
  try {
    const performanceRecords = await Performance.find({ employee: req.params.employeeId })
      .populate('employee', 'name email department');
    if (performanceRecords.length === 0) {
      return res.status(404).json({ message: 'No performance records found for this employee' });
    }
    res.json(performanceRecords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create performance record
exports.createPerformance = async (req, res) => {
  // Calculate overall score
  const metrics = req.body.metrics;
  const overallScore = metrics 
    ? Math.round((metrics.productivity + metrics.quality + metrics.teamwork + metrics.communication + metrics.innovation) / 5)
    : 0;

  const performance = new Performance({
    employee: req.body.employee,
    period: req.body.period,
    metrics: req.body.metrics,
    overallScore: overallScore,
    achievements: req.body.achievements,
    areasForImprovement: req.body.areasForImprovement,
    goals: req.body.goals,
    feedback: req.body.feedback,
  });

  try {
    const newPerformance = await performance.save();
    res.status(201).json(newPerformance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update performance record
exports.updatePerformance = async (req, res) => {
  try {
    const performance = await Performance.findById(req.params.id);
    if (!performance) {
      return res.status(404).json({ message: 'Performance record not found' });
    }

    if (req.body.metrics) {
      performance.metrics = req.body.metrics;
      performance.overallScore = Math.round(
        (req.body.metrics.productivity + req.body.metrics.quality + 
         req.body.metrics.teamwork + req.body.metrics.communication + 
         req.body.metrics.innovation) / 5
      );
    }
    if (req.body.achievements) performance.achievements = req.body.achievements;
    if (req.body.areasForImprovement) performance.areasForImprovement = req.body.areasForImprovement;
    if (req.body.goals) performance.goals = req.body.goals;
    if (req.body.feedback) performance.feedback = req.body.feedback;
    performance.updatedAt = Date.now();

    const updatedPerformance = await performance.save();
    res.json(updatedPerformance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete performance record
exports.deletePerformance = async (req, res) => {
  try {
    const performance = await Performance.findByIdAndDelete(req.params.id);
    if (!performance) {
      return res.status(404).json({ message: 'Performance record not found' });
    }
    res.json({ message: 'Performance record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get performance by period
exports.getPerformanceByPeriod = async (req, res) => {
  try {
    const performances = await Performance.find({ period: req.params.period })
      .populate('employee', 'name email department');
    res.json(performances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get performance analytics
exports.getPerformanceAnalytics = async (req, res) => {
  try {
    const period = req.params.period;
    const performances = await Performance.find({ period }).populate('employee', 'department');
    
    const analytics = {
      totalEmployees: performances.length,
      averageScore: performances.reduce((sum, p) => sum + p.overallScore, 0) / performances.length,
      topPerformers: performances
        .sort((a, b) => b.overallScore - a.overallScore)
        .slice(0, 5)
        .map(p => ({ employee: p.employee.name, score: p.overallScore })),
      departmentMetrics: {},
    };

    // Calculate department-wise metrics
    performances.forEach(perf => {
      const dept = perf.employee.department;
      if (!analytics.departmentMetrics[dept]) {
        analytics.departmentMetrics[dept] = { count: 0, totalScore: 0 };
      }
      analytics.departmentMetrics[dept].count += 1;
      analytics.departmentMetrics[dept].totalScore += perf.overallScore;
    });

    // Calculate average for each department
    Object.keys(analytics.departmentMetrics).forEach(dept => {
      analytics.departmentMetrics[dept].average = 
        Math.round(analytics.departmentMetrics[dept].totalScore / analytics.departmentMetrics[dept].count);
    });

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
