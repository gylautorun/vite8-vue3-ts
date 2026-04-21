import express, { Request, Response } from 'express';
const router = express.Router();
import Product from '../models/product';
import auth from '../middleware/auth';

// 获取商品列表
router.get('/list', (req: Request, res: Response): void => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);

    const total = Product.countDocuments();
    const allProducts = Product.find();
    const products = allProducts.slice(skip, skip + parseInt(pageSize as string));

    res.status(200).json({
      code: 200,
      message: '获取成功',
      data: {
        list: products.map(product => product.toJSON()),
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

// 获取商品详情
router.get('/detail/:id', (req: Request, res: Response): void => {
  try {
    const id = req.params.id as string;
    const product = Product.findById(parseInt(id));
    if (!product) {
      res.status(404).json({
        code: 404,
        message: '商品不存在',
        data: null
      });
      return;
    }

    res.status(200).json({
      code: 200,
      message: '获取成功',
      data: product.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

// 创建商品
router.post('/create', auth, (req: Request, res: Response): void => {
  try {
    const { name, price, description, image, category } = req.body;

    // 创建新商品
    const product = Product.create({ name, price, description, image, category });

    res.status(201).json({
      code: 201,
      message: '创建成功',
      data: product.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

// 更新商品
router.put('/update/:id', auth, (req: Request, res: Response): void => {
  try {
    const { name, price, description, image, category } = req.body;
    const id = req.params.id as string;

    // 检查商品是否存在
    const product = Product.findById(parseInt(id));
    if (!product) {
      res.status(404).json({
        code: 404,
        message: '商品不存在',
        data: null
      });
      return;
    }

    // 更新商品信息
    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (image) product.image = image;
    if (category) product.category = category;

    res.status(200).json({
      code: 200,
      message: '更新成功',
      data: product.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

// 删除商品
router.delete('/delete/:id', auth, (req: Request, res: Response): void => {
  try {
    const id = req.params.id as string;
    const product = Product.findByIdAndDelete(parseInt(id));
    if (!product) {
      res.status(404).json({
        code: 404,
        message: '商品不存在',
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

// 获取商品分类
router.get('/categories', (req: Request, res: Response): void => {
  try {
    const categories = Product.distinct('category');
    
    res.status(200).json({
      code: 200,
      message: '获取成功',
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: '服务器错误',
      data: null
    });
  }
});

// 搜索商品
router.get('/search', (req: Request, res: Response): void => {
  try {
    const { keyword, page = 1, pageSize = 10 } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(pageSize as string);

    const query = {
      $or: [
        { name: { $regex: keyword as string, $options: 'i' } },
        { description: { $regex: keyword as string, $options: 'i' } },
        { category: { $regex: keyword as string, $options: 'i' } }
      ]
    };

    const total = Product.countDocuments(query);
    const allProducts = Product.find(query);
    const products = allProducts.slice(skip, skip + parseInt(pageSize as string));

    res.status(200).json({
      code: 200,
      message: '搜索成功',
      data: {
        list: products.map(product => product.toJSON()),
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
