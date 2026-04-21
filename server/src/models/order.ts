import { db } from '../config/database';

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  toJSON(): any;
}

class OrderModel {
  // 创建订单
  create(orderData: Partial<Order>): Order {
    // 设置默认状态
    if (!orderData.status) {
      orderData.status = 'pending';
    }

    // 创建订单
    const order = db.orders.create(orderData as Order);
    return this.addMethods(order);
  }

  // 根据 ID 查找订单
  findById(id: number): Order | null {
    const order = db.orders.findById(id);
    return order ? this.addMethods(order) : null;
  }

  // 根据条件查找订单
  findOne(query: any): Order | null {
    const order = db.orders.findOne(query);
    return order ? this.addMethods(order) : null;
  }

  // 查找所有订单
  find(query: any = {}): Order[] {
    const orders = db.orders.find(query);
    return orders.map(order => this.addMethods(order));
  }

  // 删除订单
  findByIdAndDelete(id: number): Order | null {
    const order = db.orders.findByIdAndDelete(id);
    return order ? this.addMethods(order) : null;
  }

  // 统计订单数量
  countDocuments(query: any = {}): number {
    return db.orders.countDocuments(query);
  }

  // 为订单对象添加方法
  private addMethods(order: any): Order {
    return {
      ...order,
      toJSON(): any {
        return { ...order };
      }
    };
  }
}

const Order = new OrderModel();

export default Order;
