import {api} from './axios';

import type { User, PaginationResponse, PaginationParams } from '../types';

// 用户 API 模块
const userApi = {
  /**
   * 获取用户列表
   * @param params 分页参数
   * @returns 用户列表
   */
  getUsers(params: PaginationParams): Promise<PaginationResponse<User>> {
    return api.get('/users', params);
  },
  
  /**
   * 获取用户详情
   * @param id 用户 ID
   * @returns 用户详情
   */
  getUserById(id: number): Promise<User> {
    return api.get(`/users/${id}`);
  },
  
  /**
   * 创建用户
   * @param data 用户数据
   * @returns 创建的用户
   */
  createUser(data: Partial<User>): Promise<User> {
    return api.post('/users', data);
  },
  
  /**
   * 更新用户
   * @param id 用户 ID
   * @param data 更新数据
   * @returns 更新后的用户
   */
  updateUser(id: number, data: Partial<User>): Promise<User> {
    return api.put(`/users/${id}`, data);
  },
  
  /**
   * 删除用户
   * @param id 用户 ID
   * @returns 操作结果
   */
  deleteUser(id: number): Promise<boolean> {
    return api.delete(`/users/${id}`);
  },
  
  /**
   * 用户登录
   * @param data 登录数据
   * @returns 登录结果
   */
  login(data: { email: string; password: string }): Promise<{ token: string; user: User }> {
    return api.post('/auth/login', data);
  },
  
  /**
   * 用户注册
   * @param data 注册数据
   * @returns 注册结果
   */
  register(data: { name: string; email: string; password: string }): Promise<{ token: string; user: User }> {
    return api.post('/auth/register', data);
  },
  
  /**
   * 获取当前用户信息
   * @returns 当前用户信息
   */
  getCurrentUser(): Promise<User> {
    return api.get('/auth/me');
  },
  
  /**
   * 用户登出
   * @returns 操作结果
   */
  logout(): Promise<boolean> {
    return api.post('/auth/logout');
  }
};

export default userApi;
