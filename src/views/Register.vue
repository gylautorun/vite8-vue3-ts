<template>
  <div class="register">
    <div class="register-container">
      <Card class="register-card">
        <template #header>
          <div class="register-header">
            <h1>用户注册</h1>
            <p>创建一个新账户，开始您的旅程</p>
          </div>
        </template>
        
        <form @submit.prevent="handleRegister" class="register-form">
          <Input
            label="用户名"
            v-model="form.name"
            placeholder="请输入用户名"
            :error="errors.name"
            required
          />
          
          <Input
            label="邮箱"
            v-model="form.email"
            type="email"
            placeholder="请输入邮箱"
            :error="errors.email"
            required
          />
          
          <Input
            label="密码"
            v-model="form.password"
            type="password"
            placeholder="请输入密码（至少 6 位）"
            :error="errors.password"
            required
          />
          
          <Input
            label="确认密码"
            v-model="form.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            :error="errors.confirmPassword"
            required
          />
          
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.agreeTerms" />
              <span>我已阅读并同意 <a href="#" class="terms-link">服务条款</a> 和 <a href="#" class="terms-link">隐私政策</a></span>
            </label>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            class="register-button"
            :loading="loading"
            :disabled="loading || !form.agreeTerms"
          >
            {{ loading ? '注册中...' : '注册' }}
          </Button>
        </form>
        
        <div class="register-footer">
          <p>已有账户？<router-link to="/login" class="login-link">立即登录</router-link></p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Card, Input, Button } from '../components';
import { useUserStore } from '../store/user';

const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
});

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const validateForm = (): boolean => {
  let isValid = true;
  
  errors.name = '';
  errors.email = '';
  errors.password = '';
  errors.confirmPassword = '';
  
  if (!form.name) {
    errors.name = '请输入用户名';
    isValid = false;
  } else if (form.name.length < 2) {
    errors.name = '用户名长度至少为 2 位';
    isValid = false;
  }
  
  if (!form.email) {
    errors.email = '请输入邮箱';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = '请输入有效的邮箱地址';
    isValid = false;
  }
  
  if (!form.password) {
    errors.password = '请输入密码';
    isValid = false;
  } else if (form.password.length < 6) {
    errors.password = '密码长度至少为 6 位';
    isValid = false;
  }
  
  if (!form.confirmPassword) {
    errors.confirmPassword = '请确认密码';
    isValid = false;
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致';
    isValid = false;
  }
  
  if (!form.agreeTerms) {
    alert('请先阅读并同意服务条款和隐私政策');
    isValid = false;
  }
  
  return isValid;
};

const handleRegister = async () => {
  if (!validateForm()) {
    return;
  }
  
  loading.value = true;
  
  try {
    const response = await userStore.register({
      name: form.name,
      email: form.email,
      password: form.password
    });
    
    if (response) {
      alert('注册成功！即将跳转到首页...');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    }
  } catch (error) {
    console.error('注册失败:', error);
    alert('注册失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.register {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  
  .register-container {
    width: 100%;
    max-width: 400px;
    
    .register-card {
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      
      .register-header {
        text-align: center;
        margin-bottom: 20px;
        
        h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #343a40;
          margin: 0 0 8px 0;
        }
        
        p {
          font-size: 1rem;
          color: #6c757d;
          margin: 0;
        }
      }
      
      .register-form {
        .form-options {
          margin-bottom: 20px;
          
          .checkbox-label {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            cursor: pointer;
            font-size: 0.875rem;
            color: #343a40;
            line-height: 1.4;
            
            input[type="checkbox"] {
              width: 16px;
              height: 16px;
              cursor: pointer;
              margin-top: 2px;
            }
            
            .terms-link {
              color: #3498db;
              text-decoration: none;
              
              &:hover {
                text-decoration: underline;
              }
            }
          }
        }
        
        .register-button {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          font-weight: 600;
        }
      }
      
      .register-footer {
        text-align: center;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #e9ecef;
        
        p {
          margin: 0;
          font-size: 0.875rem;
          color: #6c757d;
          
          .login-link {
            color: #3498db;
            text-decoration: none;
            font-weight: 500;
            
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
}
</style>
