import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      return next(new Error('User already exists with this email'));
    }

    // Set role (restrict role choice or allow for demo)
    // For local evaluation, we'll allow role selection ('User' or 'Admin')
    const finalRole = role && ['User', 'Admin'].includes(role) ? role : 'User';

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: finalRole,
      status: 'Active', // Initial status active
    });

    if (user) {
      // Log task registration activity or just return response
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      return next(new Error('Invalid user data provided'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if email & password are provided
    if (!email || !password) {
      res.status(400);
      return next(new Error('Please provide an email and password'));
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Validate email existence and match password
    if (user && (await user.comparePassword(password))) {
      // Block login if user status is Inactive
      if (user.status === 'Inactive') {
        res.status(403);
        return next(new Error('Your account is inactive. Please contact the administrator.'));
      }

      // Track activity log: Login
      await ActivityLog.create({
        user: user._id,
        action: 'Login',
        details: `User logged in from IP ${req.ip || 'unknown'}`,
        ipAddress: req.ip || 'unknown',
      });

      res.status(200).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/v1/auth/me
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    // req.user was attached in authMiddleware
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
