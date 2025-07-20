import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark
} from '../controllers/bookmarkController.js';

const router = express.Router();

router.get('/', authenticateToken, getBookmarks);
router.post('/', authenticateToken, createBookmark);
router.put('/:id ', authenticateToken, updateBookmark);
router.delete('/:id ', authenticateToken, deleteBookmark);

export default router;