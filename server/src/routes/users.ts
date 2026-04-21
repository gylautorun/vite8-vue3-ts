import express, { Request, Response } from 'express';
const router = express.Router();
import User from '../models/user';
import auth from '../middleware/auth';
import bcrypt from 'bcrypt';

// 获取用户列表
router.get('/list', auth, (req: Request, res: Response): void => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);

    const total = User.countDocuments();
    const allUsers = User.find();
    const users = allUsers.slice(skip, skip + parseInt(pageSize as string));

    res.status(200).json({
      code: 200,
      message: '获取成功',
      data: {
        list: users.map(user => user.toJSON()),
        total,
        page: parseInt(page as string),
        pageSize: parseInt(pageSize as string),
        totalPages: Math.ceil(total / parseInt(pageSize as string))
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

// 获取用户详情
router.get('/detail/:id', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const user = await User.findById(parseInt(id));
    if (!user) {
      res.status(404).json({
        code: 404,
        message: '用户不存在',
        data: null
      });
      return;
    }

    res.status(200).json({
      code: 200,
      message: '获取成功',
      data: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

// 创建用户
router.post('/create', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email });
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

    res.status(201).json({
      code: 201,
      message: '创建成功',
      data: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

// 更新用户
router.put('/:id', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const id = req.params.id as string;

    // 检查用户是否存在
    const user = await User.findById(parseInt(id));
    if (!user) {
      res.status(404).json({
        code: 404,
        message: '用户不存在',
        data: null
      });
      return;
    }

    // 检查邮箱是否已被其他用户使用
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          code: 400,
          message: '邮箱已被注册',
          data: null
        });
        return;
      }
    }

    // 更新用户信息
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      // 密码需要重新加密
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    res.status(200).json({
      code: 200,
      message: '更新成功',
      data: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

// 删除用户
router.delete('/delete/:id', auth, (req: Request, res: Response): void => {
  try {
    const id = req.params.id as string;
    const user = User.findByIdAndDelete(parseInt(id));
    if (!user) {
      res.status(404).json({
        code: 404,
        message: '用户不存在',
        data: null
      });
      return;
    }

    res.status(200).json({
      code: 200,
      message: '删除成功',
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
