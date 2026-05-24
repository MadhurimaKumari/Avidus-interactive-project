import User from '../models/User.js';
import Task from '../models/Task.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Get all users in the system
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user account
// @route   DELETE /api/v1/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    // Do not allow deleting self (the admin performing the delete)
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      return next(new Error('You cannot delete your own administrative account'));
    }

    const userName = user.name;
    // Delete all tasks associated with this user
    await Task.deleteMany({ user: user._id });
    // Delete the user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: `User '${userName}' and their tasks have been deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (Active/Inactive)
// @route   PUT /api/v1/admin/users/:id/status
// @access  Private (Admin)
export const updateUserStatus = async (req, res, next) => {
  const { status } = req.body;

  try {
    if (!status || !['Active', 'Inactive'].includes(status)) {
      res.status(400);
      return next(new Error('Please provide a valid status: Active or Inactive'));
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }

    // Do not allow changing own status
    if (user._id.toString() === req.user._id.toString()) {
      res.status(400);
      return next(new Error('You cannot change your own account status'));
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    View all tasks created by all users
// @route   GET /api/v1/admin/tasks
// @access  Private (Admin)
export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({})
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete any task created by users
// @route   DELETE /api/v1/admin/tasks/:id
// @access  Private (Admin)
export const deleteAnyTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }

    const title = task.title;
    const taskOwnerId = task.user;

    await task.deleteOne();

    // Track activity log: Task Deletion by Admin
    await ActivityLog.create({
      user: req.user._id, // Admin id
      action: 'Task Deletion',
      details: `Admin deleted task "${title}" owned by user ID ${taskOwnerId}`,
      ipAddress: req.ip || 'unknown',
    });

    res.status(200).json({
      success: true,
      message: `Task "${title}" deleted successfully by administrator`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    View all activity logs in system
// @route   GET /api/v1/admin/logs
// @access  Private (Admin)
export const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find({})
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard analytics metrics
// @route   GET /api/v1/admin/analytics
// @access  Private (Admin)
export const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalTasks = await Task.countDocuments({});
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const pendingTasks = await Task.countDocuments({ status: 'Pending' });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalTasks,
        completedTasks,
        pendingTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};
