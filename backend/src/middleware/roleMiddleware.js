export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized, credentials missing'));
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(
        new Error(`Access denied. Role '${req.user.role}' is not authorized to access this resource.`)
      );
    }

    next();
  };
};

export const adminOnly = authorizeRoles('Admin');
export const userOnly = authorizeRoles('User');
