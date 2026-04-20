import {api} from './axios';

import type { Product, PaginationResponse, PaginationParams } from '../types';

// 商品 API 模块
const productApi = {
  /**
   * 获取商品列表
   * @param params 分页参数
   * @returns 商品列表
   */
  getProducts(params: PaginationParams): Promise<PaginationResponse<Product>> {
    return api.get('/products', params);
  },
  
  /**
   * 获取商品详情
   * @param id 商品 ID
   * @returns 商品详情
   */
  getProductById(id: number): Promise<Product> {
    return api.get(`/products/${id}`);
  },
  
  /**
   * 创建商品
   * @param data 商品数据
   * @returns 创建的商品
   */
  createProduct(data: Partial<Product>): Promise<Product> {
    return api.post('/products', data);
  },
  
  /**
   * 更新商品
   * @param id 商品 ID
   * @param data 更新数据
   * @returns 更新后的商品
   */
  updateProduct(id: number, data: Partial<Product>): Promise<Product> {
    return api.put(`/products/${id}`, data);
  },
  
  /**
   * 删除商品
   * @param id 商品 ID
   * @returns 操作结果
   */
  deleteProduct(id: number): Promise<boolean> {
    return api.delete(`/products/${id}`);
  },
  
  /**
   * 获取商品分类
   * @returns 商品分类列表
   */
  getCategories(): Promise<string[]> {
    return api.get('/products/categories');
  },
  
  /**
   * 搜索商品
   * @param keyword 搜索关键词
   * @param params 分页参数
   * @returns 搜索结果
   */
  searchProducts(keyword: string, params: PaginationParams): Promise<PaginationResponse<Product>> {
    return api.get('/products/search', { keyword, ...params });
  }
};

export default productApi;
