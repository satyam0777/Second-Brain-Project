import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import { validateBookmark } from '../middleware/validateMiddleware.js';
import {
  getBookmarks,
  getBookmarkById,
  createBookmark,
  updateBookmark,
  deleteBookmark
} from '../controllers/bookmarkController.js';

const router = express.Router();

router.get('/', authenticateToken, getBookmarks);
router.post('/', authenticateToken, validateBookmark, createBookmark);
router.get('/:id', authenticateToken, getBookmarkById);
router.put('/:id', authenticateToken, updateBookmark);
router.delete('/:id', authenticateToken, deleteBookmark);

export default router;