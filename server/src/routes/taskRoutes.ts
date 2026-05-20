import { Router } from 'express';
import { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  getTasksByProject 
} from '../controllers/taskController';
import { 
  taskCreateValidation, 
  taskIdValidation, 
  projectIdParamValidation 
} from '../validations/taskValidation';
import { protect, isAdmin } from '../middleware/auth';

const router = Router();

router.get('/', protect, getTasks);
router.post('/', protect, isAdmin, taskCreateValidation, createTask);
router.put('/:id', protect, taskIdValidation, updateTask);
router.delete('/:id', protect, isAdmin, taskIdValidation, deleteTask);
router.get('/project/:projectId', protect, projectIdParamValidation, getTasksByProject);

export default router;
