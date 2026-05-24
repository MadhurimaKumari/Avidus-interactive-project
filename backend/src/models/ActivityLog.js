import mongoose from 'mongoose';
import { MemoryActivityLog } from '../utils/memoryStore.js';

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      enum: ['Login', 'Task Creation', 'Task Update', 'Task Deletion'],
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

const ActivityLog = process.env.USE_MEMORY_DB === 'true'
  ? MemoryActivityLog
  : mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
