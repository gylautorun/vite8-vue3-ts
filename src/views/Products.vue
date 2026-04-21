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
            <div class="product-actions">
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
import { ref, onMounted } from 'vue';
import { useProductStore } from '../store/product';
import { Button, Card, Input } from '../components';
import type { Product } from '../types';

const productStore = useProductStore();

// 状态
const products = ref([]);
const page = ref(1);
const pageSize = ref(12);
const total = ref(0);
const totalPages = ref(1);
const loading = ref(false);
const searchKeyword = ref('');

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
