import express, { Request, Response } from 'express';
const router = express.Router();
import User from '../models/user';
import { generateToken } from '../utils/jwt';
import auth from '../middleware/auth';

// 用户注册
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // 检查邮箱是否已存在
    const existingUser = User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        code: 400,
        message: '邮箱已被注册',
        data: null
      });
      return;
    }

    // 创建新用户
    const user = await User.create({ name, email, password });

    // 生成令牌
    const token = generateToken(user.id.toString());

    res.status(201).json({
      code: 201,
      message: '注册成功',
      data: {
        token,
        user: user.toJSON()
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

// 用户登录
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = User.findOne({ email });
    if (!user) {
      res.status(400).json({
        code: 400,
        message: '邮箱或密码错误',
        data: null
      });
      return;
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({
        code: 400,
        message: '邮箱或密码错误',
        data: null
      });
      return;
    }

    // 生成令牌
    const token = generateToken(user.id.toString());

    res.status(200).json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: user.toJSON()
      }
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

// 获取当前用户信息
router.get('/me', auth, (req: Request, res: Response): void => {
  try {
    res.status(200).json({
      code: 200,
      message: '获取成功',
      data: (req as any).user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

// 用户登出
router.post('/logout', auth, (req: Request, res: Response): void => {
  try {
    // 这里可以实现令牌黑名单功能，暂时简单返回成功
    res.status(200).json({
      code: 200,
      message: '登出成功',
      data: true
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

export default router;
