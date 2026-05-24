import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_jwt_sign_key_for_avidus_interactive_rbac_system_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

export default generateToken;
