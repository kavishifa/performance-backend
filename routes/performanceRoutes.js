const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');

// Get all performance records
router.get('/', performanceController.getAllPerformance);

// Get performance by employee
router.get('/employee/:employeeId', performanceController.getPerformanceByEmployee);

// Get performance by period
router.get('/period/:period', performanceController.getPerformanceByPeriod);

// Get performance analytics
router.get('/analytics/:period', performanceController.getPerformanceAnalytics);

// Create performance record
router.post('/', performanceController.createPerformance);

// Update performance record
router.put('/:id', performanceController.updatePerformance);

// Delete performance record
router.delete('/:id', performanceController.deletePerformance);

module.exports = router;
