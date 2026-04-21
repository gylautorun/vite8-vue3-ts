import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User from '../models/user';

const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({
        code: 40001,
        message: '未提供认证令牌',
        data: null
      });
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({
        code: 40001,
        message: '无效的认证令牌',
        data: null
      });
      return;
    }

    const user = await User.findById(parseInt(decoded.id));

    if (!user) {
      res.status(401).json({
        code: 40002,
        message: '用户不存在',
        data: null
      });
      return;
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
};

export default auth;
