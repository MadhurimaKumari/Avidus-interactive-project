import mongoose from 'mongoose';
import { MemoryTask } from '../utils/memoryStore.js';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
    dueDate: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task owner (User) is required'],
    },
  },
  {
    timestamps: true,
  }
);

const Task = process.env.USE_MEMORY_DB === 'true' ? MemoryTask : mongoose.model('Task', taskSchema);
export default Task;
