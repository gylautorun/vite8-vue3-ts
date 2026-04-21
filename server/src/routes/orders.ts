import express, { Request, Response } from 'express';
const router = express.Router();
import Order from '../models/order';
import Product from '../models/product';
import auth from '../middleware/auth';

// 获取订单列表
router.get('/list', auth, (req: Request, res: Response): void => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);

    const total = Order.countDocuments();
    const allOrders = Order.find();
    const orders = allOrders.slice(skip, skip + parseInt(pageSize as string));

    res.status(200).json({
      code: 200,
      message: '获取成功',
      data: {
        list: orders.map(order => order.toJSON()),
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

// 获取订单详情
router.get('/detail/:id', auth, (req: Request, res: Response): void => {
  try {
    const id = req.params.id as string;
    const order = Order.findById(parseInt(id));
    if (!order) {
      res.status(404).json({
        code: 404,
        message: '订单不存在',
        data: null
      });
      return;
    }

    res.status(200).json({
      code: 200,
      message: '获取成功',
      data: order.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

// 创建订单
router.post('/create', auth, (req: Request, res: Response): void => {
  try {
    const { userId, items } = req.body;

    // 计算总价格
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = Product.findById(item.productId);
      if (!product) {
        res.status(404).json({
          code: 404,
          message: `商品 ${item.productId} 不存在`,
          data: null
        });
        return;
      }

      const itemPrice = product.price * item.quantity;
      totalPrice += itemPrice;
      
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      });
    }

    // 创建订单
    const order = Order.create({
      userId,
      totalPrice,
      items: orderItems
    });

    res.status(201).json({
      code: 201,
      message: '创建成功',
      data: order.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

// 更新订单状态
router.patch('/update/status/:id', auth, (req: Request, res: Response): void => {
  try {
    const { status } = req.body;
    const id = req.params.id as string;

    // 检查订单是否存在
    const order = Order.findById(parseInt(id));
    if (!order) {
      res.status(404).json({
        code: 404,
        message: '订单不存在',
        data: null
      });
      return;
    }

    // 检查状态是否有效
    const validStatuses: string[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        code: 400,
        message: '无效的订单状态',
        data: null
      });
      return;
    }

    // 更新状态
    order.status = status as any;

    res.status(200).json({
      code: 200,
      message: '更新成功',
      data: order.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

// 删除订单
router.delete('/delete/:id', auth, (req: Request, res: Response): void => {
  try {
    const id = req.params.id as string;
    const order = Order.findByIdAndDelete(parseInt(id));
    if (!order) {
      res.status(404).json({
        code: 404,
        message: '订单不存在',
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

// 获取用户订单列表
router.get('/userOrders/:userId', auth, (req: Request, res: Response): void => {
  try {
    const userId = req.params.userId as string;
    const { page = 1, pageSize = 10 } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);

    const total = Order.countDocuments({ userId: parseInt(userId) });
    const allOrders = Order.find({ userId: parseInt(userId) });
    const orders = allOrders.slice(skip, skip + parseInt(pageSize as string));

    res.status(200).json({
      code: 200,
      message: '获取成功',
      data: {
        list: orders.map(order => order.toJSON()),
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

export default router;
