import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_sign_key_for_avidus_interactive_rbac_system_2026'
      );

      // Get user from the token. Mongoose supports select(); the development
      // in-memory store returns the user directly.
      const userLookup = User.findById(decoded.id);
      const user = typeof userLookup.select === 'function'
        ? await userLookup.select('-password')
        : await userLookup;

      if (user?.password) {
        delete user.password;
      }

      if (!user) {
        res.status(401);
        return next(new Error('Not authorized, user not found'));
      }

      // Check if user account is Active
      if (user.status === 'Inactive') {
        res.status(403);
        return next(new Error('Your account is inactive. Please contact the administrator.'));
      }

      // Set user on request
      req.user = user;
      return next();
    } catch (error) {
      console.error(`[AuthMiddleware] JWT Verification Failed: ${error.message}`);
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token provided'));
  }
};
