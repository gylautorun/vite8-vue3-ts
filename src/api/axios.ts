import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from '../types';


// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

/**
 * 跳转到登录页
 */
function redirectToLogin() {
  // 跳转到登录页
  localStorage.removeItem('token');
  localStorage.removeItem('userInfo');
  window.location.href = '/login';
}
// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const res = response.data;
    
    // 检查响应码
    if (res.code !== 200) {
      // 处理错误
      console.error('响应错误:', res.message);
      
      // 处理特定错误码
      switch (res.code) {
        case 40001:
          // 未登录，跳转到登录页
          console.error('未登录，请重新登录');
          // 跳转到登录页
          redirectToLogin();
          break;
        case 40002:
          // 用户不存在
          console.error('用户不存在');
          break;
        case 40003:
          // 无权限
          console.error('无权限访问');
          break;
        case 401:
          // 未授权，跳转到登录页
          console.error('未授权，请重新登录');
          // 跳转到登录页
          redirectToLogin();
          break;
        case 403:
          // 禁止访问
          console.error('禁止访问');
          break;
        case 404:
          // 资源不存在
          console.error('资源不存在');
          break;
        case 500:
          // 服务器错误
          console.error('服务器错误');
          break;
        default:
          // 其他错误
          console.error(res.message);
      }
      
      return Promise.reject(new Error(res.message || '未知错误'));
    }
    
    return res.data;
  },
  (error) => {
    console.error('响应错误:', error);
    
    // 处理网络错误
    if (!error.response) {
      console.error('网络错误，请检查网络连接');
      return Promise.reject(new Error('网络错误，请检查网络连接'));
    }
    
    // 处理 HTTP 错误
    const status = error.response.status;
    switch (status) {
      case 401:
        console.error('未授权，请重新登录');
        redirectToLogin();
        // 可以在这里添加跳转到登录页的逻辑
        break;
      case 403:
        console.error('禁止访问');
        break;
      case 404:
        console.error('资源不存在');
        break;
      case 500:
        console.error('服务器错误');
        break;
      default:
        console.error(`HTTP 错误 ${status}`);
    }
    
    return Promise.reject(error);
  }
);

// 封装请求方法
export const api = {
  /**
   * GET 请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 配置选项
   * @returns 响应数据
   */
  get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, { params, ...config });
  },
  
  /**
   * POST 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 配置选项
   * @returns 响应数据
   */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.post(url, data, config);
  },
  
  /**
   * PUT 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 配置选项
   * @returns 响应数据
   */
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.put(url, data, config);
  },
  
  /**
   * DELETE 请求
   * @param url 请求地址
   * @param params 请求参数
   * @param config 配置选项
   * @returns 响应数据
   */
  delete<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, { params, ...config });
  },
  
  /**
   * PATCH 请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 配置选项
   * @returns 响应数据
   */
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return service.patch(url, data, config);
  }
};

export default service;
