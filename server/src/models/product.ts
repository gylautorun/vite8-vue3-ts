// import { db } from '../config/database';
import { db } from '../config/define-data';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  toJSON(): any;
}

class ProductModel {
  // 创建商品
  create(productData: Partial<Product>): Product {
    // 设置默认图片
    if (!productData.image) {
      productData.image = 'https://via.placeholder.com/300';
    }

    // 创建商品
    const product = db.products.create(productData as Product);
    return this.addMethods(product);
  }

  // 根据 ID 查找商品
  findById(id: number): Product | null {
    const product = db.products.findById(id);
    return product ? this.addMethods(product) : null;
  }

  // 根据条件查找商品
  findOne(query: any): Product | null {
    const product = db.products.findOne(query);
    return product ? this.addMethods(product) : null;
  }

  // 查找所有商品
  find(query: any = {}): Product[] {
    const products = db.products.find(query);
    return products.map(product => this.addMethods(product));
  }

  // 删除商品
  findByIdAndDelete(id: number): Product | null {
    const product = db.products.findByIdAndDelete(id);
    return product ? this.addMethods(product) : null;
  }

  // 统计商品数量
  countDocuments(query: any = {}): number {
    return db.products.countDocuments(query);
  }

  // 获取商品分类
  distinct(field: string): string[] {
    return db.products.distinct(field) as string[];
  }

  // 为商品对象添加方法
  private addMethods(product: any): Product {
    // 直接在原对象上添加方法，而不是返回一个新对象
    product.toJSON = function(): any {
      return { ...this };
    };
    return product as Product;
  }

  // 保存商品
  save(product: any): Product {
    return this.addMethods(db.products.save(product));
  }
}

const Product = new ProductModel();

export default Product;
