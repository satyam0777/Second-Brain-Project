import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import { getUserActivities } from '../controllers/activityController.js';

const activityRouter = express.Router();

activityRouter.get('/', authenticateToken, getUserActivities);

export default activityRouter;