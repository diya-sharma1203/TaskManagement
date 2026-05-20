import { Router } from 'express';
import { 
  getProjects, 
  createProject, 
  getProjectById, 
  updateProject, 
  deleteProject 
} from '../controllers/projectController';
import { projectCreateValidation, projectIdValidation } from '../validations/projectValidation';
import { protect, isAdmin } from '../middleware/auth';

const router = Router();

router.get('/', protect, getProjects);
router.post('/', protect, isAdmin, projectCreateValidation, createProject);
router.get('/:id', protect, projectIdValidation, getProjectById);
router.put('/:id', protect, isAdmin, ...projectIdValidation, ...projectCreateValidation, updateProject);
router.delete('/:id', protect, isAdmin, projectIdValidation, deleteProject);

export default router;
