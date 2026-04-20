import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import productApi from '../api/product';
import type { Product } from '../types';


// 商品状态管理
export const useProductStore = defineStore('product', () => {
  // 状态
  const products = ref<Product[]>([]);
  const product = ref<Product | null>(null);
  const categories = ref<string[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // 计算属性
  const productCount = computed(() => products.value.length);
  
  // 方法
  const fetchProducts = async (params: { page: number; pageSize: number }) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await productApi.getProducts(params);
      products.value = response.list;
      return response;
    } catch (err) {
      error.value = '获取商品列表失败';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const fetchProductById = async (id: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      const productData = await productApi.getProductById(id);
      product.value = productData;
      return productData;
    } catch (err) {
      error.value = '获取商品详情失败';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const createProduct = async (data: Partial<Product>) => {
    loading.value = true;
    error.value = null;
    
    try {
      const productData = await productApi.createProduct(data);
      products.value.push(productData);
      return productData;
    } catch (err) {
      error.value = '创建商品失败';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const updateProduct = async (id: number, data: Partial<Product>) => {
    loading.value = true;
    error.value = null;
    
    try {
      const productData = await productApi.updateProduct(id, data);
      const index = products.value.findIndex(p => p.id === id);
      if (index !== -1) {
        products.value[index] = productData;
      }
      if (product.value?.id === id) {
        product.value = productData;
      }
      return productData;
    } catch (err) {
      error.value = '更新商品失败';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const deleteProduct = async (id: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      const success = await productApi.deleteProduct(id);
      if (success) {
        products.value = products.value.filter(p => p.id !== id);
      }
      return success;
    } catch (err) {
      error.value = '删除商品失败';
      console.error(err);
      return false;
    } finally {
      loading.value = false;
    }
  };
  
  const fetchCategories = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const categoryList = await productApi.getCategories();
      categories.value = categoryList;
      return categoryList;
    } catch (err) {
      error.value = '获取商品分类失败';
      console.error(err);
      return [];
    } finally {
      loading.value = false;
    }
  };
  
  const searchProducts = async (keyword: string, params: { page: number; pageSize: number }) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await productApi.searchProducts(keyword, params);
      products.value = response.list;
      return response;
    } catch (err) {
      error.value = '搜索商品失败';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  return {
    products,
    product,
    categories,
    loading,
    error,
    productCount,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchCategories,
    searchProducts
  };
});
