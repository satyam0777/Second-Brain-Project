import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import authenticateToken from '../middleware/authMiddleware.js';
import { validateRegistration, validateLogin } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', authenticateToken, getMe);

export default router;