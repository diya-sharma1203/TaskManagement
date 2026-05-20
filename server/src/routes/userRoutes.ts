import { Router } from 'express';
import { getTeamMembers } from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/team', protect, getTeamMembers);

export default router;
