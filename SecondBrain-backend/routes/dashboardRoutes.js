import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  getRecentActivities
} from '../controllers/dashboardController.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/stats', authenticateToken, getDashboardStats);
dashboardRouter.get('/activity', authenticateToken, getRecentActivities);

export default dashboardRouter;