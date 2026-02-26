import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import { getAnalytics, getStatsSummary } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/', authenticateToken, getAnalytics);
router.get('/stats', authenticateToken, getStatsSummary);
router.get('/summary', authenticateToken, getStatsSummary);

export default router;
