const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController.js');
const { authenticate } = require('../middleware/auth.js')

router.get('/analytics/total/customers', analyticsController.totalCustomers);
router.get('/analytics/collectibles', analyticsController.collectibles);
router.get('/analytics/today/collection', analyticsController.todayCollection);
router.get('/analytics/loan-categories', analyticsController.loanCategories);
router.get('/analytics/rider-summary', analyticsController.riderSummary);
router.get('/analytics/top-riders', analyticsController.topRiders);
router.get('/analytics/payment-status-distribution', analyticsController.paymentStatusDistribution);
router.get('/analytics/total/revenue', analyticsController.totalRevenue);
router.get('/analytics/total/riders', analyticsController.totalRiders);
router.get('/analytics/total/areas', analyticsController.totalAreas);
router.get('/analytics/total/companies', analyticsController.totalCompanies);
router.get('/analytics/total/overdue', analyticsController.totalOverdue);
router.get('/analytics/top/areas', analyticsController.topPerformingAreas)
router.get('/analytics/total/payments', analyticsController.totalPayments);
router.get('/analytics/collection-rate', analyticsController.collectionRate);
router.get('/analytics/active-riders/today', analyticsController.activeRidersToday);
router.get('/analytics/trends/hourly-collection', analyticsController.hourlyCollectionTrend);
router.get('/analytics/performance/area-daily', analyticsController.areaDailyPerformance);
router.get('/analytics/top/riders-today', analyticsController.topPerformingRidersToday);
router.get('/analytics/monthly', analyticsController.monthlyAnalytics)
router.get('/analytics/recent-activities', analyticsController.recentActivities);
router.get('/analytics/active-loans', analyticsController.activeLoans);
router.get('/analytics/monthly/revenue', analyticsController.monthlyRevenue)
router.get('/analytics/get/today/count', analyticsController.todayCollectionCount);
router.get('/analytics/today/payment-status-distribution', analyticsController.paymentTodayStatusDistribution);
// router.get('/analytics/today/collection/rider', authenticate, analyticsController.todayCollectionCountRider);
module.exports = router;    