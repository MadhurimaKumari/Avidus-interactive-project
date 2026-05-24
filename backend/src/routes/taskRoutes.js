import express from 'express';
import {
  createTask,
  getMyTasks,
  updateMyTask,
  deleteMyTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createTask)
  .get(protect, getMyTasks);

router.route('/:id')
  .put(protect, updateMyTask)
  .delete(protect, deleteMyTask);

export default router;
