// === /routes/searchRoutes.js ===
import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import { searchAll } from '../controllers/searchController.js';

const searchRouter = express.Router();

// searchRouter.get('/', authenticateToken, searchAll);/
searchRouter.get('/', searchAll);


export default searchRouter;