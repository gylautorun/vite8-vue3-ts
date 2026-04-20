<template>
  <div class="admin">
    <div class="admin-header">
      <h1>管理后台</h1>
      <div class="admin-actions">
        <Button variant="secondary" @click="refreshData">刷新数据</Button>
        <Button variant="danger" @click="logout">退出登录</Button>
      </div>
    </div>
    
    <div class="admin-stats">
      <Card class="stat-card">
        <template #header>
          <h3>总用户数</h3>
        </template>
        <div class="stat-value">{{ stats.totalUsers }}</div>
        <div class="stat-change positive">+{{ stats.userGrowth }}%</div>
      </Card>
      
      <Card class="stat-card">
        <template #header>
          <h3>总订单数</h3>
        </template>
        <div class="stat-value">{{ stats.totalOrders }}</div>
        <div class="stat-change positive">+{{ stats.orderGrowth }}%</div>
      </Card>
      
      <Card class="stat-card">
        <template #header>
          <h3>总商品数</h3>
        </template>
        <div class="stat-value">{{ stats.totalProducts }}</div>
        <div class="stat-change negative">-{{ stats.productDecline }}%</div>
      </Card>
      
      <Card class="stat-card">
        <template #header>
          <h3>总收入</h3>
        </template>
        <div class="stat-value">¥{{ stats.totalRevenue }}</div>
        <div class="stat-change positive">+{{ stats.revenueGrowth }}%</div>
      </Card>
    </div>
    
    <div class="admin-content">
      <div class="admin-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <div class="admin-tab-content">
        <!-- 用户管理 -->
        <div v-if="activeTab === 'users'" class="tab-panel">
          <Card>
            <template #header>
              <h3>用户管理</h3>
              <Button variant="primary" size="small" @click="openAddUserModal">添加用户</Button>
            </template>
            <div class="user-list">
              <div v-for="user in users" :key="user.id" class="user-item">
                <div class="user-info">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-email">{{ user.email }}</div>
                  <div class="user-role">
                    <span :class="['role-badge', `role-${user.role}`]">{{ user.role }}</span>
                  </div>
                </div>
                <div class="user-actions">
                  <Button size="small" variant="info" @click="editUser(user)">编辑</Button>
                  <Button size="small" variant="danger" @click="deleteUser(user.id)">删除</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <!-- 系统设置 -->
        <div v-if="activeTab === 'settings'" class="tab-panel">
          <Card>
            <template #header>
              <h3>系统设置</h3>
            </template>
            <div class="settings-form">
              <Input
                label="系统名称"
                v-model="settings.systemName"
                placeholder="请输入系统名称"
              />
              <Input
                label="管理员邮箱"
                v-model="settings.adminEmail"
                type="email"
                placeholder="请输入管理员邮箱"
              />
              <div class="setting-item">
                <label>启用用户注册</label>
                <input type="checkbox" v-model="settings.enableRegistration" />
              </div>
              <div class="setting-item">
                <label>启用邮件通知</label>
                <input type="checkbox" v-model="settings.enableEmailNotification" />
              </div>
              <div class="setting-actions">
                <Button variant="primary" @click="saveSettings">保存设置</Button>
                <Button @click="resetSettings">重置</Button>
              </div>
            </div>
          </Card>
        </div>
        
        <!-- 日志查看 -->
        <div v-if="activeTab === 'logs'" class="tab-panel">
          <Card>
            <template #header>
              <h3>系统日志</h3>
              <Button variant="secondary" size="small" @click="clearLogs">清空日志</Button>
            </template>
            <div class="logs-list">
              <div v-for="(log, index) in logs" :key="index" class="log-item">
                <div class="log-time">{{ log.time }}</div>
                <div :class="['log-level', `log-${log.level}`]">{{ log.level }}</div>
                <div class="log-message">{{ log.message }}</div>
              </div>
              <div v-if="logs.length === 0" class="empty">
                <p>暂无日志记录</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
    
    <!-- 添加/编辑用户模态框 -->
    <div v-if="showUserModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditingUser ? '编辑用户' : '添加用户' }}</h3>
          <Button variant="danger" size="small" @click="showUserModal = false">关闭</Button>
        </div>
        <div class="modal-body">
          <Input
            label="用户名"
            v-model="userForm.name"
            placeholder="请输入用户名"
            required
          />
          <Input
            label="邮箱"
            v-model="userForm.email"
            type="email"
            placeholder="请输入邮箱"
            required
          />
          <div class="form-group">
            <label>角色</label>
            <select v-model="userForm.role">
              <option value="user">普通用户</option>
              <option value="admin">管理员</option>
              <option value="superadmin">超级管理员</option>
            </select>
          </div>
          <Input
            v-if="!isEditingUser"
            label="密码"
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
            required
          />
        </div>
        <div class="modal-footer">
          <Button @click="showUserModal = false">取消</Button>
          <Button variant="primary" @click="saveUser" :loading="loading">保存</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Card, Button, Input } from '../components';

const router = useRouter();

const activeTab = ref('users');
const loading = ref(false);
const showUserModal = ref(false);
const isEditingUser = ref(false);

const tabs = [
  { key: 'users', label: '用户管理' },
  { key: 'settings', label: '系统设置' },
  { key: 'logs', label: '系统日志' }
];

const stats = ref({
  totalUsers: 1250,
  userGrowth: 12.5,
  totalOrders: 3420,
  orderGrowth: 8.3,
  totalProducts: 156,
  productDecline: 2.1,
  totalRevenue: 125000,
  revenueGrowth: 15.7
});

const users = ref([
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: 'user' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: 'superadmin' }
]);

const settings = ref({
  systemName: 'Vue 3 管理系统',
  adminEmail: 'admin@example.com',
  enableRegistration: true,
  enableEmailNotification: false
});

const logs = ref([
  { time: '2024-01-20 10:30:00', level: 'info', message: '用户张三登录系统' },
  { time: '2024-01-20 10:25:00', level: 'warning', message: '检测到异常登录尝试' },
  { time: '2024-01-20 10:20:00', level: 'error', message: '数据库连接失败' },
  { time: '2024-01-20 10:15:00', level: 'info', message: '系统备份完成' }
]);

const userForm = ref({
  name: '',
  email: '',
  role: 'user',
  password: ''
});

onMounted(() => {
  checkPermissions();
});

const checkPermissions = () => {
  const token = localStorage.getItem('token');
  const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
  const userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
  
  if (!token) {
    router.push('/login');
    return;
  }
  
  if (!userRoles.includes('admin')) {
    alert('您没有访问管理后台的权限');
    router.push('/');
    return;
  }
  
  const requiredPermissions = ['user:read', 'user:write'];
  const hasPermission = requiredPermissions.some(permission => userPermissions.includes(permission));
  
  if (!hasPermission) {
    alert('您没有足够的权限访问管理后台');
    router.push('/');
  }
};

const refreshData = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    alert('数据刷新成功');
  }, 1000);
};

const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('token');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('userPermissions');
    router.push('/login');
  }
};

const openAddUserModal = () => {
  isEditingUser.value = false;
  userForm.value = {
    name: '',
    email: '',
    role: 'user',
    password: ''
  };
  showUserModal.value = true;
};

const editUser = (user: any) => {
  isEditingUser.value = true;
  userForm.value = {
    name: user.name,
    email: user.email,
    role: user.role,
    password: ''
  };
  showUserModal.value = true;
};

const saveUser = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    showUserModal.value = false;
    alert(isEditingUser.value ? '用户更新成功' : '用户添加成功');
  }, 1000);
};

const deleteUser = (id: number) => {
  if (confirm('确定要删除这个用户吗？')) {
    loading.value = true;
    setTimeout(() => {
      users.value = users.value.filter(user => user.id !== id);
      loading.value = false;
      alert('用户删除成功');
    }, 1000);
  }
};

const saveSettings = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    alert('设置保存成功');
  }, 1000);
};

const resetSettings = () => {
  settings.value = {
    systemName: 'Vue 3 管理系统',
    adminEmail: 'admin@example.com',
    enableRegistration: true,
    enableEmailNotification: false
  };
};

const clearLogs = () => {
  if (confirm('确定要清空所有日志吗？')) {
    logs.value = [];
  }
};
</script>

<style scoped lang="scss">
.admin {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  
  .admin-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    
    h1 {
      font-size: 2rem;
      color: #343a40;
      margin: 0;
    }
    
    .admin-actions {
      display: flex;
      gap: 10px;
    }
  }
  
  .admin-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
    
    .stat-card {
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
      }
      
      .stat-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #343a40;
        margin: 10px 0;
      }
      
      .stat-change {
        font-size: 1rem;
        font-weight: 500;
        
        &.positive {
          color: #2ecc71;
        }
        
        &.negative {
          color: #e74c3c;
        }
      }
    }
  }
  
  .admin-content {
    .admin-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      
      .tab {
        padding: 10px 20px;
        border: 1px solid #e9ecef;
        border-radius: 4px;
        background-color: white;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
        
        &:hover {
          background-color: #f8f9fa;
        }
        
        &.active {
          background-color: #3498db;
          color: white;
          border-color: #3498db;
        }
      }
    }
    
    .admin-tab-content {
      .tab-panel {
        .user-list {
          .user-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            border-bottom: 1px solid #e9ecef;
            
            &:last-child {
              border-bottom: none;
            }
            
            .user-info {
              flex: 1;
              
              .user-name {
                font-size: 16px;
                font-weight: 600;
                color: #343a40;
                margin-bottom: 4px;
              }
              
              .user-email {
                font-size: 14px;
                color: #6c757d;
                margin-bottom: 4px;
              }
              
              .user-role {
                .role-badge {
                  display: inline-block;
                  padding: 2px 8px;
                  border-radius: 4px;
                  font-size: 12px;
                  font-weight: 500;
                  
                  &.role-admin {
                    background-color: #3498db;
                    color: white;
                  }
                  
                  &.role-superadmin {
                    background-color: #e74c3c;
                    color: white;
                  }
                  
                  &.role-user {
                    background-color: #95a5a6;
                    color: white;
                  }
                }
              }
            }
            
            .user-actions {
              display: flex;
              gap: 8px;
            }
          }
        }
        
        .settings-form {
          .setting-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            padding: 12px;
            background-color: #f8f9fa;
            border-radius: 4px;
            
            label {
              font-weight: 500;
              color: #343a40;
            }
            
            input[type="checkbox"] {
              width: 20px;
              height: 20px;
              cursor: pointer;
            }
          }
          
          .setting-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
          }
        }
        
        .logs-list {
          .log-item {
            display: grid;
            grid-template-columns: 180px 80px 1fr;
            gap: 10px;
            padding: 12px;
            border-bottom: 1px solid #e9ecef;
            
            &:last-child {
              border-bottom: none;
            }
            
            .log-time {
              font-size: 14px;
              color: #6c757d;
            }
            
            .log-level {
              font-size: 12px;
              font-weight: 500;
              padding: 2px 8px;
              border-radius: 4px;
              text-align: center;
              
              &.log-info {
                background-color: #3498db;
                color: white;
              }
              
              &.log-warning {
                background-color: #f39c12;
                color: white;
              }
              
              &.log-error {
                background-color: #e74c3c;
                color: white;
              }
            }
            
            .log-message {
              font-size: 14px;
              color: #343a40;
            }
          }
          
          .empty {
            padding: 40px;
            text-align: center;
            color: #6c757d;
          }
        }
      }
    }
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
        
        .form-group {
          margin-bottom: 16px;
          
          label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #343a40;
          }
          
          select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 14px;
            color: #343a40;
            transition: all 0.3s ease;
            
            &:focus {
              outline: none;
              border-color: #3498db;
              box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
            }
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
