<template>
  <div class="products">
    <h1>商品管理</h1>
    
    <div class="actions">
      <Input
        v-model="searchKeyword"
        placeholder="搜索商品"
        class="search-input"
      />
      <Button variant="primary" @click="searchProducts">搜索</Button>
      <Button variant="primary" @click="openAddProductModal">添加商品</Button>
    </div>
    
    <Card>
      <template #header>
        <h3>商品列表</h3>
        <div class="order-info">
          <span>订单商品数: {{ orderItemCount }} / {{ maxOrderItems }}</span>
        </div>
      </template>
      <div class="products-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
          </div>
          <div class="product-info">
            <h4>{{ product.name }}</h4>
            <p class="product-price">¥{{ product.price }}</p>
            <p class="product-description">{{ product.description }}</p>
            <div class="product-quantity">
              <Input
                type="number"
                v-model="productQuantities[product.id]"
                min="1"
                max="99"
                placeholder="数量"
                size="small"
                :disabled="isOrderFull"
              />
            </div>
            <div class="product-actions">
              <Button size="small" variant="success" @click="addToOrder(product)" :disabled="isOrderFull">加入订单</Button>
              <Button size="small" variant="info" @click="openEditProductModal(product)">编辑</Button>
              <Button size="small" variant="danger" @click="deleteProduct(product.id)">删除</Button>
            </div>
          </div>
        </div>
        <div v-if="products.length === 0" class="empty">
          <p>暂无商品数据</p>
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
    
    <!-- 订单确认模态框 -->
    <div v-if="showOrderModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>确认订单</h3>
          <Button variant="danger" size="small" @click="showOrderModal = false">关闭</Button>
        </div>
        <div class="modal-body">
          <h4>订单商品</h4>
          <div class="order-items">
            <div v-for="item in orderItems" :key="item.productId" class="order-item">
              <span>{{ getProductName(item.productId) }}</span>
              <span>数量: {{ item.quantity }}</span>
              <span>价格: ¥{{ getProductPrice(item.productId) * item.quantity }}</span>
            </div>
          </div>
          <div class="order-total">
            <strong>总计: ¥{{ orderTotal }}</strong>
          </div>
        </div>
        <div class="modal-footer">
          <Button @click="showOrderModal = false">取消</Button>
          <Button variant="primary" @click="submitOrder" :loading="orderLoading">
            确认创建订单
          </Button>
        </div>
      </div>
    </div>
    
    <!-- 添加/编辑商品模态框 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditing ? '编辑商品' : '添加商品' }}</h3>
          <Button variant="danger" size="small" @click="showModal = false">关闭</Button>
        </div>
        <div class="modal-body">
          <Input
            label="商品名称"
            v-model="formData.name"
            placeholder="请输入商品名称"
            required
          />
          <Input
            label="商品价格"
            v-model="formData.price"
            type="number"
            placeholder="请输入商品价格"
            required
          />
          <Input
            label="商品描述"
            v-model="formData.description"
            placeholder="请输入商品描述"
          />
          <Input
            label="商品图片"
            v-model="formData.image"
            placeholder="请输入商品图片 URL"
          />
          <Input
            label="商品分类"
            v-model="formData.category"
            placeholder="请输入商品分类"
          />
        </div>
        <div class="modal-footer">
          <Button @click="showModal = false">取消</Button>
          <Button variant="primary" @click="submitForm" :loading="loading">
            {{ isEditing ? '更新' : '添加' }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useProductStore } from '../store/product';
import { useOrderStore } from '../store/order';
import { Button, Card, Input } from '../components';
import type { Product } from '../types';

const productStore = useProductStore();
const orderStore = useOrderStore();

// 状态
const products = ref<Product[]>([]);
const page = ref(1);
const pageSize = ref(12);
const total = ref(0);
const totalPages = ref(1);
const loading = ref(false);
const searchKeyword = ref('');
const productQuantities = ref<Record<number, number>>({});

// 订单相关状态
const showOrderModal = ref(false);
const orderItems = ref<Array<{ productId: number; quantity: number }>>([]);
const orderLoading = ref(false);
const maxOrderItems = 10; // 订单中最多商品数量

// 模态框状态
const showModal = ref(false);
const isEditing = ref(false);
const formData = ref<Partial<Product>>({
  name: '',
  price: 0,
  description: '',
  image: '',
  category: ''
});

// 计算属性
const orderTotal = computed(() => {
  return orderItems.value.reduce((total, item) => {
    const product = products.value.find(p => p.id === item.productId);
    return total + (product?.price || 0) * item.quantity;
  }, 0);
});

const orderItemCount = computed(() => {
  return orderItems.value.reduce((count, item) => count + item.quantity, 0);
});

const isOrderFull = computed(() => {
  return orderItemCount.value >= maxOrderItems;
});

// 生命周期
onMounted(() => {
  fetchProducts();
  fetchCategories();
});

// 方法
const fetchProducts = async () => {
  loading.value = true;
  const response = await productStore.fetchProducts({
    page: page.value,
    pageSize: pageSize.value
  });
  if (response) {
    products.value = response.list;
    total.value = response.total;
    totalPages.value = response.totalPages;
    // 初始化商品数量
    response.list.forEach((product: Product) => {
      if (!productQuantities.value[product.id]) {
        productQuantities.value[product.id] = 1;
      }
    });
  }
  loading.value = false;
};

const fetchCategories = async () => {
  await productStore.fetchCategories();
};

const changePage = (newPage: number) => {
  page.value = newPage;
  fetchProducts();
};

const searchProducts = async () => {
  loading.value = true;
  const response = await productStore.searchProducts(searchKeyword.value, {
    page: page.value,
    pageSize: pageSize.value
  });
  if (response) {
    products.value = response.list;
    total.value = response.total;
    totalPages.value = response.totalPages;
    // 初始化商品数量
    response.list.forEach((product: Product) => {
      if (!productQuantities.value[product.id]) {
        productQuantities.value[product.id] = 1;
      }
    });
  }
  loading.value = false;
};

const openAddProductModal = () => {
  isEditing.value = false;
  formData.value = {
    name: '',
    price: 0,
    description: '',
    image: '',
    category: ''
  };
  showModal.value = true;
};

const openEditProductModal = (product: Product) => {
  isEditing.value = true;
  formData.value = {
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description,
    image: product.image,
    category: product.category
  };
  showModal.value = true;
};

const submitForm = async () => {
  loading.value = true;
  if (isEditing.value) {
    // 编辑商品
    await productStore.updateProduct(formData.value.id, {
      ...formData.value,
      price: Number(formData.value.price)
    });
  } else {
    // 添加商品
    await productStore.createProduct({
      ...formData.value,
      price: Number(formData.value.price)
    });
  }
  showModal.value = false;
  fetchProducts();
  loading.value = false;
};

const deleteProduct = async (id: number) => {
  if (confirm('确定要删除这个商品吗？')) {
    loading.value = true;
    await productStore.deleteProduct(id);
    fetchProducts();
    loading.value = false;
  }
};

// 订单相关方法
const addToOrder = (product: Product) => {
  if (isOrderFull.value) {
    alert('订单已达到最大商品数量限制');
    return;
  }
  
  const quantity = productQuantities.value[product.id] || 1;
  const remainingQuantity = maxOrderItems - orderItemCount.value;
  const actualQuantity = Math.min(quantity, remainingQuantity);
  
  if (actualQuantity > 0) {
    orderItems.value.push({ productId: product.id, quantity: actualQuantity });
    // 恢复数量为 1
    productQuantities.value[product.id] = 1;
    showOrderModal.value = true;
  }
};

const getProductName = (productId: number) => {
  const product = products.value.find(p => p.id === productId);
  return product?.name || '未知商品';
};

const getProductPrice = (productId: number) => {
  const product = products.value.find(p => p.id === productId);
  return product?.price || 0;
};

const submitOrder = async () => {
  orderLoading.value = true;
  try {
    // 这里使用固定的 userId 1，实际应用中应该从登录状态获取
    await orderStore.createOrder({ userId: 1, items: orderItems.value });
    alert('订单创建成功！');
    showOrderModal.value = false;
    orderItems.value = [];
    // 恢复所有商品数量为 1
    products.value.forEach((product: Product) => {
      productQuantities.value[product.id] = 1;
    });
  } catch (error) {
    console.error('创建订单失败:', error);
    alert('订单创建失败，请重试');
  } finally {
    orderLoading.value = false;
  }
};
</script>

<style scoped lang="scss">
.products {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  h1 {
    font-size: 2rem;
    color: #343a40;
    margin-bottom: 20px;
  }
  
  .actions {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    
    .search-input {
      flex: 1;
      max-width: 400px;
    }
  }
  
  .order-info {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #6c757d;
    
    span {
      font-weight: 600;
      color: #e74c3c;
    }
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    
    .product-card {
      border: 1px solid #e9ecef;
      border-radius: 8px;
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
      
      .product-image {
        height: 200px;
        overflow: hidden;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .product-info {
        padding: 16px;
        
        h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .product-price {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 700;
          color: #e74c3c;
        }
        
        .product-description {
          margin: 0 0 16px 0;
          font-size: 14px;
          color: #6c757d;
          line-height: 1.4;
        }
        
        .product-quantity {
          margin-bottom: 12px;
        }
        
        .product-actions {
          display: flex;
          gap: 8px;
        }
      }
    }
    
    .empty {
      grid-column: 1 / -1;
      padding: 40px;
      text-align: center;
      color: #6c757d;
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
      max-width: 500px;
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
        
        h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .order-items {
          margin-bottom: 20px;
          
          .order-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e9ecef;
            
            &:last-child {
              border-bottom: none;
            }
          }
        }
        
        .order-total {
          display: flex;
          justify-content: flex-end;
          padding-top: 16px;
          border-top: 1px solid #e9ecef;
          
          strong {
            font-size: 16px;
            color: #e74c3c;
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
