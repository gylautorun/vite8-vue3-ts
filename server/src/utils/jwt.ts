import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET as string;
  const options = {
    expiresIn: process.env.JWT_EXPIRES_IN
  };
  return jwt.sign({ id: userId }, secret, options as jwt.SignOptions);
};

export const verifyToken = (token: string): jwt.JwtPayload | null => {
  try {
    const secret = process.env.JWT_SECRET as string;
    return jwt.verify(token, secret) as jwt.JwtPayload;
  } catch (error) {
    return null;
  }
};
