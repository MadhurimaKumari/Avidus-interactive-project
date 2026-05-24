import express from 'express';
import {
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getAllTasks,
  deleteAnyTask,
  getActivityLogs,
  getAnalytics,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/status', updateUserStatus);
router.get('/tasks', getAllTasks);
router.delete('/tasks/:id', deleteAnyTask);
router.get('/logs', getActivityLogs);
router.get('/analytics', getAnalytics);

export default router;
