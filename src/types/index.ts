// API 响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 分页响应类型
export interface PaginationResponse<T = any> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 分页请求参数类型
export interface PaginationParams {
  page: number;
  pageSize: number;
  [key: string]: any;
}

// 用户类型
export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

// 商品类型
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

// 订单类型
export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

// 订单项类型
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
}
