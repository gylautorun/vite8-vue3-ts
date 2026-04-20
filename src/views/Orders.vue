<template>
  <div class="orders">
    <h1>订单管理</h1>
    
    <Card>
      <template #header>
        <h3>订单列表</h3>
      </template>
      <div class="orders-table">
        <table>
          <thead>
            <tr>
              <th>订单 ID</th>
              <th>用户 ID</th>
              <th>总金额</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>{{ order.id }}</td>
              <td>{{ order.userId }}</td>
              <td>¥{{ order.totalPrice }}</td>
              <td>
                <span :class="['status', `status--${order.status}`]">
                  {{ getStatusText(order.status) }}
                </span>
              </td>
              <td>{{ formatDate(order.createdAt) }}</td>
              <td>
                <Button size="small" variant="info" @click="viewOrderDetails(order)">查看详情</Button>
                <Button size="small" variant="primary" @click="updateOrderStatus(order)">更新状态</Button>
                <Button size="small" variant="danger" @click="deleteOrder(order.id)">删除</Button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="orders.length === 0" class="empty">
          <p>暂无订单数据</p>
        </div>
      </div>
      <template #footer>
        <div class="pagination">
          <Button 
            size="small" 
            :disabled="page === 1" 
            @click="changePage(page - 1)"
          >
            上一页
          </Button>
          <span>{{ page }} / {{ totalPages }}</span>
          <Button 
            size="small" 
            :disabled="page === totalPages" 
            @click="changePage(page + 1)"
          >
            下一页
          </Button>
        </div>
      </template>
    </Card>
    
    <!-- 订单详情模态框 -->
    <div v-if="showDetailsModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>订单详情</h3>
          <Button variant="danger" size="small" @click="showDetailsModal = false">关闭</Button>
        </div>
        <div class="modal-body">
          <div class="order-info">
            <p><strong>订单 ID:</strong> {{ selectedOrder?.id }}</p>
            <p><strong>用户 ID:</strong> {{ selectedOrder?.userId }}</p>
            <p><strong>总金额:</strong> ¥{{ selectedOrder?.totalPrice }}</p>
            <p><strong>状态:</strong> {{ getStatusText(selectedOrder?.status) }}</p>
            <p><strong>创建时间:</strong> {{ formatDate(selectedOrder?.createdAt) }}</p>
          </div>
          <h4>订单商品</h4>
          <div class="order-items">
            <div v-for="item in selectedOrder?.items" :key="item.id" class="order-item">
              <div class="item-info">
                <p><strong>商品 ID:</strong> {{ item.productId }}</p>
                <p><strong>数量:</strong> {{ item.quantity }}</p>
                <p><strong>单价:</strong> ¥{{ item.price }}</p>
                <p><strong>小计:</strong> ¥{{ item.quantity * item.price }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <Button @click="showDetailsModal = false">关闭</Button>
        </div>
      </div>
    </div>
    
    <!-- 更新订单状态模态框 -->
    <div v-if="showStatusModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>更新订单状态</h3>
          <Button variant="danger" size="small" @click="showStatusModal = false">关闭</Button>
        </div>
        <div class="modal-body">
          <p>订单 ID: {{ selectedOrder?.id }}</p>
          <p>当前状态: {{ getStatusText(selectedOrder?.status) }}</p>
          <div class="status-select">
            <label>新状态:</label>
            <select v-model="newStatus">
              <option value="pending">待支付</option>
              <option value="paid">已支付</option>
              <option value="shipped">已发货</option>
              <option value="delivered">已送达</option>
              <option value="cancelled">已取消</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <Button @click="showStatusModal = false">取消</Button>
          <Button variant="primary" @click="submitStatusUpdate" :loading="loading">更新</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Order, OrderItem } from '../types';
import { useOrderStore } from '../store/order';
import { formatDate } from '../utils/date';
import { Button, Card } from '../components';

const orderStore = useOrderStore();

// 状态
const orders = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const totalPages = ref(1);
const loading = ref(false);

interface SelectedOrder {
  id: number;
  userId: number;
  totalPrice: number;
  status: Order['status'];
  createdAt: string;
  items: OrderItem[];
}

// 模态框状态
const showDetailsModal = ref(false);
const showStatusModal = ref(false);
const selectedOrder = ref<SelectedOrder | null>(null);
const newStatus = ref<Order['status']>('pending');

// 生命周期
onMounted(() => {
  fetchOrders();
});

// 方法
const fetchOrders = async () => {
  loading.value = true;
  const response = await orderStore.fetchOrders({
    page: page.value,
    pageSize: pageSize.value
  });
  if (response) {
    orders.value = response.list;
    total.value = response.total;
    totalPages.value = response.totalPages;
  }
  loading.value = false;
};

const changePage = (newPage: number) => {
  page.value = newPage;
  fetchOrders();
};

const getStatusText = (status: string) => {
  const statusMap = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    delivered: '已送达',
    cancelled: '已取消'
  };
  return statusMap[status] || status;
};

const viewOrderDetails = (order: any) => {
  selectedOrder.value = order;
  showDetailsModal.value = true;
};

const updateOrderStatus = (order: any) => {
  selectedOrder.value = order;
  newStatus.value = order.status;
  showStatusModal.value = true;
};

const submitStatusUpdate = async () => {
  if (!selectedOrder.value) return;
  
  loading.value = true;
  await orderStore.updateOrderStatus(selectedOrder.value.id, newStatus.value);
  showStatusModal.value = false;
  fetchOrders();
  loading.value = false;
};

const deleteOrder = async (id: number) => {
  if (confirm('确定要删除这个订单吗？')) {
    loading.value = true;
    await orderStore.deleteOrder(id);
    fetchOrders();
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.orders {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  h1 {
    font-size: 2rem;
    color: #343a40;
    margin-bottom: 20px;
  }
  
  .orders-table {
    overflow-x: auto;
    
    table {
      width: 100%;
      border-collapse: collapse;
      
      th,
      td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #e9ecef;
      }
      
      th {
        background-color: #f8f9fa;
        font-weight: 600;
      }
      
      tr:hover {
        background-color: #f8f9fa;
      }
    }
    
    .empty {
      padding: 40px;
      text-align: center;
      color: #6c757d;
    }
  }
  
  .status {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    
    &--pending {
      background-color: #f39c12;
      color: white;
    }
    
    &--paid {
      background-color: #2ecc71;
      color: white;
    }
    
    &--shipped {
      background-color: #3498db;
      color: white;
    }
    
    &--delivered {
      background-color: #17a2b8;
      color: white;
    }
    
    &--cancelled {
      background-color: #e74c3c;
      color: white;
    }
  }
  
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    
    .modal-content {
      background-color: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      
      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border-bottom: 1px solid #e9ecef;
        
        h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }
      }
      
      .modal-body {
        padding: 16px;
        
        .order-info {
          margin-bottom: 20px;
          
          p {
            margin: 8px 0;
          }
        }
        
        h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .order-items {
          border: 1px solid #e9ecef;
          border-radius: 4px;
          
          .order-item {
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
            
            &:last-child {
              border-bottom: none;
            }
            
            .item-info {
              p {
                margin: 4px 0;
              }
            }
          }
        }
        
        .status-select {
          margin-top: 16px;
          
          label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
          }
          
          select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
          }
        }
      }
      
      .modal-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
        padding: 16px;
        border-top: 1px solid #e9ecef;
        background-color: #f8f9fa;
      }
    }
  }
}
</style>
