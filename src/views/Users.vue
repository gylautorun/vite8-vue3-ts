<template>
  <div class="users">
    <h1>用户管理</h1>
    
    <div class="actions">
      <Button variant="primary" @click="openAddUserModal">添加用户</Button>
    </div>
    
    <Card>
      <template #header>
        <h3>用户列表</h3>
      </template>
      <div class="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>姓名</th>
              <th>邮箱</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td>
                <Button size="small" variant="info" @click="openEditUserModal(user)">编辑</Button>
                <Button size="small" variant="danger" @click="deleteUser(user.id)">删除</Button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="users.length === 0" class="empty">
          <p>暂无用户数据</p>
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
    
    <!-- 添加/编辑用户模态框 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditing ? '编辑用户' : '添加用户' }}</h3>
          <Button variant="danger" size="small" @click="showModal = false">关闭</Button>
        </div>
        <div class="modal-body">
          <Input
            label="姓名"
            v-model="formData.name"
            placeholder="请输入姓名"
            required
          />
          <Input
            label="邮箱"
            v-model="formData.email"
            type="email"
            placeholder="请输入邮箱"
            required
          />
          <Input
            label="密码"
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            :required="!isEditing"
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
import { useUserStore } from '../store/user';
import { formatDate } from '../utils/date';
import { Button, Card, Input } from '../components';

const userStore = useUserStore();

// 状态
const users = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const totalPages = ref(1);
const loading = ref(false);

// 模态框状态
const showModal = ref(false);
const isEditing = ref(false);
const formData = ref({
  name: '',
  email: '',
  password: ''
});

// 生命周期
onMounted(() => {
  fetchUsers();
});

// 方法
const fetchUsers = async () => {
  loading.value = true;
  const response = await userStore.fetchUsers({
    page: page.value,
    pageSize: pageSize.value
  });
  if (response) {
    users.value = response.list;
    total.value = response.total;
    totalPages.value = response.totalPages;
  }
  loading.value = false;
};

const changePage = (newPage: number) => {
  page.value = newPage;
  fetchUsers();
};

const openAddUserModal = () => {
  isEditing.value = false;
  formData.value = {
    name: '',
    email: '',
    password: ''
  };
  showModal.value = true;
};

const openEditUserModal = (user: any) => {
  isEditing.value = true;
  formData.value = {
    name: user.name,
    email: user.email,
    password: ''
  };
  showModal.value = true;
};

const submitForm = async () => {
  loading.value = true;
  if (isEditing.value) {
    // 编辑用户
    // 这里需要获取当前编辑的用户 ID
    // await userStore.updateUser(userId, formData.value);
  } else {
    // 添加用户
    await userStore.createUser(formData.value);
  }
  showModal.value = false;
  fetchUsers();
  loading.value = false;
};

const deleteUser = async (id: number) => {
  if (confirm('确定要删除这个用户吗？')) {
    loading.value = true;
    await userStore.deleteUser(id);
    fetchUsers();
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.users {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  h1 {
    font-size: 2rem;
    color: #343a40;
    margin-bottom: 20px;
  }
  
  .actions {
    margin-bottom: 20px;
  }
  
  .users-table {
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
