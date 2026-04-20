import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import orderApi from '../api/order';
import type { Order } from '../types';


// 订单状态管理
export const useOrderStore = defineStore('order', () => {
  // 状态
  const orders = ref<Order[]>([]);
  const order = ref<Order | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // 计算属性
  const orderCount = computed(() => orders.value.length);
  const pendingOrders = computed(() => orders.value.filter(o => o.status === 'pending'));
  const paidOrders = computed(() => orders.value.filter(o => o.status === 'paid'));
  const shippedOrders = computed(() => orders.value.filter(o => o.status === 'shipped'));
  const deliveredOrders = computed(() => orders.value.filter(o => o.status === 'delivered'));
  const cancelledOrders = computed(() => orders.value.filter(o => o.status === 'cancelled'));
  
  // 方法
  const fetchOrders = async (params: { page: number; pageSize: number }) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await orderApi.getOrders(params);
      orders.value = response.list;
      return response;
    } catch (err) {
      error.value = '获取订单列表失败';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const fetchOrderById = async (id: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      const orderData = await orderApi.getOrderById(id);
      order.value = orderData;
      return orderData;
    } catch (err) {
      error.value = '获取订单详情失败';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const createOrder = async (data: { userId: number; items: Array<{ productId: number; quantity: number }> }) => {
    loading.value = true;
    error.value = null;
    
    try {
      const orderData = await orderApi.createOrder(data);
      orders.value.push(orderData);
      return orderData;
    } catch (err) {
      error.value = '创建订单失败';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const updateOrderStatus = async (id: number, status: Order['status']) => {
    loading.value = true;
    error.value = null;
    
    try {
      const orderData = await orderApi.updateOrderStatus(id, status);
      const index = orders.value.findIndex(o => o.id === id);
      if (index !== -1) {
        orders.value[index] = orderData;
      }
      if (order.value?.id === id) {
        order.value = orderData;
      }
      return orderData;
    } catch (err) {
      error.value = '更新订单状态失败';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const deleteOrder = async (id: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      const success = await orderApi.deleteOrder(id);
      if (success) {
        orders.value = orders.value.filter(o => o.id !== id);
      }
      return success;
    } catch (err) {
      error.value = '删除订单失败';
      console.error(err);
      return false;
    } finally {
      loading.value = false;
    }
  };
  
  const fetchUserOrders = async (userId: number, params: { page: number; pageSize: number }) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await orderApi.getUserOrders(userId, params);
      orders.value = response.list;
      return response;
    } catch (err) {
      error.value = '获取用户订单失败';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  return {
    orders,
    order,
    loading,
    error,
    orderCount,
    pendingOrders,
    paidOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    fetchOrders,
    fetchOrderById,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    fetchUserOrders
  };
});
