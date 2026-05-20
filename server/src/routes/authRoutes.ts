import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController';
import { registerValidation, loginValidation } from '../validations/authValidation';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.get('/me', protect, getMe);

export default router;
