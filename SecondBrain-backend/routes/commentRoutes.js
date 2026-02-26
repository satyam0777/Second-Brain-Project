
import authenticateToken from '../middleware/authMiddleware.js';
import { validateComment } from '../middleware/validateMiddleware.js';

import express from 'express';
import { getComments, createComment, getAllUserComments } from '../controllers/commentController.js';


const router = express.Router();

router.get('/', authenticateToken, getAllUserComments);
router.get('/:referenceId', authenticateToken, getComments);      
router.post('/', authenticateToken, validateComment, createComment);               

export default router;
