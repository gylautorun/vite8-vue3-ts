<template>
  <div class="login">
    <div class="login-container">
      <Card class="login-card">
        <template #header>
          <div class="login-header">
            <h1>用户登录</h1>
            <p>欢迎回来，请登录您的账户</p>
          </div>
        </template>
        
        <form @submit.prevent="handleLogin" class="login-form">
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
            placeholder="请输入密码"
            :error="errors.password"
            required
          />
          
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="form.rememberMe" />
              <span>记住我</span>
            </label>
            <a href="#" class="forgot-password">忘记密码？</a>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            class="login-button"
            :loading="loading"
            :disabled="loading"
          >
            {{ loading ? '登录中...' : '登录' }}
          </Button>
        </form>
        
        <div class="login-footer">
          <p>还没有账户？<router-link to="/register" class="register-link">立即注册</router-link></p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Card, Input, Button } from '../components';
import { useUserStore } from '../store/user';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const loading = ref(false);
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
});

const errors = reactive({
  email: '',
  password: ''
});

const validateForm = (): boolean => {
  let isValid = true;
  
  errors.email = '';
  errors.password = '';
  
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
  
  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) {
    return;
  }
  
  loading.value = true;
  
  try {
    const response = await userStore.login({
      email: form.email,
      password: form.password
    });
    
    if (response) {
      const redirectPath = (route.query.redirect as string) || '/';
      
      if (form.rememberMe) {
        localStorage.setItem('rememberEmail', form.email);
      } else {
        localStorage.removeItem('rememberEmail');
      }
      
      router.push(redirectPath);
    }
  } catch (error) {
    console.error('登录失败:', error);
    alert('登录失败，请检查邮箱和密码');
  } finally {
    loading.value = false;
  }
};

const loadRememberedEmail = () => {
  const rememberedEmail = localStorage.getItem('rememberEmail');
  if (rememberedEmail) {
    form.email = rememberedEmail;
    form.rememberMe = true;
  }
};

loadRememberedEmail();
</script>

<style scoped lang="scss">
.login {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  
  .login-container {
    width: 100%;
    max-width: 400px;
    
    .login-card {
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      
      .login-header {
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
      
      .login-form {
        .form-options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          
          .checkbox-label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-size: 0.875rem;
            color: #343a40;
            
            input[type="checkbox"] {
              width: 16px;
              height: 16px;
              cursor: pointer;
            }
          }
          
          .forgot-password {
            font-size: 0.875rem;
            color: #3498db;
            text-decoration: none;
            
            &:hover {
              text-decoration: underline;
            }
          }
        }
        
        .login-button {
          width: 100%;
          padding: 12px;
          font-size: 1rem;
          font-weight: 600;
        }
      }
      
      .login-footer {
        text-align: center;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #e9ecef;
        
        p {
          margin: 0;
          font-size: 0.875rem;
          color: #6c757d;
          
          .register-link {
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
