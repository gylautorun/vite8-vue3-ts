import {api} from './axios';

import type { Order, PaginationResponse, PaginationParams } from '../types';

// 订单 API 模块
const orderApi = {
  /**
   * 获取订单列表
   * @param params 分页参数
   * @returns 订单列表
   */
  getOrders(params: PaginationParams): Promise<PaginationResponse<Order>> {
    return api.get('/orders', params);
  },
  
  /**
   * 获取订单详情
   * @param id 订单 ID
   * @returns 订单详情
   */
  getOrderById(id: number): Promise<Order> {
    return api.get(`/orders/${id}`);
  },
  
  /**
   * 创建订单
   * @param data 订单数据
   * @returns 创建的订单
   */
  createOrder(data: { userId: number; items: Array<{ productId: number; quantity: number }> }): Promise<Order> {
    return api.post('/orders', data);
  },
  
  /**
   * 更新订单状态
   * @param id 订单 ID
   * @param status 订单状态
   * @returns 更新后的订单
   */
  updateOrderStatus(id: number, status: Order['status']): Promise<Order> {
    return api.patch(`/orders/${id}/status`, { status });
  },
  
  /**
   * 删除订单
   * @param id 订单 ID
   * @returns 操作结果
   */
  deleteOrder(id: number): Promise<boolean> {
    return api.delete(`/orders/${id}`);
  },
  
  /**
   * 获取用户订单列表
   * @param userId 用户 ID
   * @param params 分页参数
   * @returns 订单列表
   */
  getUserOrders(userId: number, params: PaginationParams): Promise<PaginationResponse<Order>> {
    return api.get(`/users/${userId}/orders`, params);
  }
};

export default orderApi;
