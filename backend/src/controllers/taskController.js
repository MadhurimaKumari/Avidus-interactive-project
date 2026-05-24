import Task from '../models/Task.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Create a new task
// @route   POST /api/v1/tasks
// @access  Private (User/Admin)
export const createTask = async (req, res, next) => {
  const { title, description, dueDate } = req.body;

  try {
    if (!title) {
      res.status(400);
      return next(new Error('Task title is required'));
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      user: req.user._id,
    });

    // Track activity log: Task Creation
    await ActivityLog.create({
      user: req.user._id,
      action: 'Task Creation',
      details: `Created task "${task.title}"`,
      ipAddress: req.ip || 'unknown',
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for the logged-in user
// @route   GET /api/v1/tasks
// @access  Private (User/Admin)
export const getMyTasks = async (req, res, next) => {
  try {
    // Return only tasks owned by the logged-in user
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a user's own task
// @route   PUT /api/v1/tasks/:id
// @access  Private (User/Admin)
export const updateMyTask = async (req, res, next) => {
  const { title, description, status, dueDate } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }

    // Ensure the task belongs to the logged-in user
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Access denied. You cannot modify other users\' tasks.'));
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    const updatedTask = await task.save();

    // Track activity log: Task Update
    await ActivityLog.create({
      user: req.user._id,
      action: 'Task Update',
      details: `Updated task "${updatedTask.title}" (Status: ${updatedTask.status})`,
      ipAddress: req.ip || 'unknown',
    });

    res.status(200).json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user's own task
// @route   DELETE /api/v1/tasks/:id
// @access  Private (User/Admin)
export const deleteMyTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }

    // Ensure the task belongs to the logged-in user
    if (task.user.toString() !== req.user._id.toString()) {
      res.status(403);
      return next(new Error('Access denied. You cannot delete other users\' tasks.'));
    }

    const title = task.title;
    await task.deleteOne();

    // Track activity log: Task Deletion
    await ActivityLog.create({
      user: req.user._id,
      action: 'Task Deletion',
      details: `Deleted task "${title}"`,
      ipAddress: req.ip || 'unknown',
    });

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
