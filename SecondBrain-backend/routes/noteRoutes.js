
import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import { validateNote } from '../middleware/validateMiddleware.js';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getSingleNote
} from '../controllers/noteController.js';

const router = express.Router();



router.get('/', authenticateToken, getNotes);
router.post('/', authenticateToken, validateNote, createNote);
router.get('/:id', authenticateToken, getSingleNote);
router.put('/:id', authenticateToken, updateNote);     
router.delete('/:id', authenticateToken, deleteNote);
export default router;