const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');

// Get all evaluations
router.get('/', evaluationController.getAllEvaluations);

// Get evaluations by employee
router.get('/employee/:employeeId', evaluationController.getEvaluationsByEmployee);

// Get evaluations by period
router.get('/period/:period', evaluationController.getEvaluationsByPeriod);

// Create evaluation
router.post('/', evaluationController.createEvaluation);

// Update evaluation
router.put('/:id', evaluationController.updateEvaluation);

// Submit evaluation
router.patch('/:id/submit', evaluationController.submitEvaluation);

// Delete evaluation
router.delete('/:id', evaluationController.deleteEvaluation);

module.exports = router;
