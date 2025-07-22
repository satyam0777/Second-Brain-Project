
import authenticateToken from '../middleware/authMiddleware.js';

import express from 'express';
import { getComments, createComment } from '../controllers/commentController.js';
// import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/:referenceId', authenticateToken, getComments);      // GET /api/comments/:referenceId
router.post('/', authenticateToken, createComment);               // POST /api/comments

export default router;
