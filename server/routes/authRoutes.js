import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import protect from '../middleware/auth.js';
import { forgotPassword, getMe, login, register, resetPassword } from '../controllers/authController.js';

const router = Router();
const validate = (req, res, next) => { const errors = validationResult(req); return errors.isEmpty() ? next() : res.status(400).json({ message: errors.array()[0].msg }); };

router.post('/register', [body('name').trim().notEmpty(), body('email').isEmail().normalizeEmail(), body('password').isLength({ min: 6 })], validate, register);
router.post('/login', [body('email').isEmail().normalizeEmail(), body('password').notEmpty()], validate, login);
router.post('/forgot-password', [body('email').isEmail().normalizeEmail()], validate, forgotPassword);
router.post('/reset-password', [body('token').notEmpty(), body('password').isLength({ min: 6 })], validate, resetPassword);
router.get('/me', protect, getMe);
export default router;