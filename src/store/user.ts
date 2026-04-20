import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import userApi from '../api/user';
import type { User } from '../types';


// 用户状态管理
export const useUserStore = defineStore('user', () => {
  // 状态
  const currentUser = ref<User | null>(null);
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // 计算属性
  const isLoggedIn = computed(() => !!currentUser.value);
  
  // 方法
  const fetchUsers = async (params: { page: number; pageSize: number }) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await userApi.getUsers(params);
      users.value = response.list;
      return response;
    } catch (err) {
      error.value = '获取用户列表失败';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const fetchUserById = async (id: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      const user = await userApi.getUserById(id);
      return user;
    } catch (err) {
      error.value = '获取用户详情失败';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const createUser = async (data: Partial<User>) => {
    loading.value = true;
    error.value = null;
    
    try {
      const user = await userApi.createUser(data);
      users.value.push(user);
      return user;
    } catch (err) {
      error.value = '创建用户失败';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const updateUser = async (id: number, data: Partial<User>) => {
    loading.value = true;
    error.value = null;
    
    try {
      const user = await userApi.updateUser(id, data);
      const index = users.value.findIndex(u => u.id === id);
      if (index !== -1) {
        users.value[index] = user;
      }
      if (currentUser.value?.id === id) {
        currentUser.value = user;
      }
      return user;
    } catch (err) {
      error.value = '更新用户失败';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const deleteUser = async (id: number) => {
    loading.value = true;
    error.value = null;
    
    try {
      const success = await userApi.deleteUser(id);
      if (success) {
        users.value = users.value.filter(u => u.id !== id);
      }
      return success;
    } catch (err) {
      error.value = '删除用户失败';
      console.error(err);
      return false;
    } finally {
      loading.value = false;
    }
  };
  
  const login = async (data: { email: string; password: string }) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await userApi.login(data);
      currentUser.value = response.user;
      localStorage.setItem('token', response.token);
      return response;
    } catch (err) {
      error.value = '登录失败';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const register = async (data: { name: string; email: string; password: string }) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await userApi.register(data);
      currentUser.value = response.user;
      localStorage.setItem('token', response.token);
      return response;
    } catch (err) {
      error.value = '注册失败';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const getCurrentUser = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const user = await userApi.getCurrentUser();
      currentUser.value = user;
      return user;
    } catch (err) {
      error.value = '获取当前用户信息失败';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const logout = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      await userApi.logout();
      currentUser.value = null;
      localStorage.removeItem('token');
      return true;
    } catch (err) {
      error.value = '登出失败';
      console.error(err);
      return false;
    } finally {
      loading.value = false;
    }
  };
  
  return {
    currentUser,
    users,
    loading,
    error,
    isLoggedIn,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    login,
    register,
    getCurrentUser,
    logout
  };
});
