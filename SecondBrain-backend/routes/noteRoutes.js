// === /routes/noteRoutes.js ===
import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getSingleNote
} from '../controllers/noteController.js';

const router = express.Router();



router.get('/', authenticateToken, getNotes);
router.post('/', authenticateToken, createNote);
router.put('/:id', authenticateToken, updateNote);     
router.delete('/:id', authenticateToken, deleteNote);  
router.get('/:id', authenticateToken, getSingleNote);

router.get('/:id', authenticateToken, (req, res) => {
  if (!req.params.id || req.params.id === 'undefined') {
    return res.status(400).json({ error: 'Note ID is required' });
  }
  getSingleNote(req, res);
});
export default router;