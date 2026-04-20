<template>
  <div class="home">
    <h1>Vue 3 + Vite 8 + TypeScript</h1>
    <p>Welcome to your Vue 3 application!</p>
    
    <div class="cards">
      <Card class="card">
        <template #header>
          <h3>用户管理</h3>
        </template>
        <p>管理系统用户，包括添加、编辑、删除用户等功能。</p>
        <template #footer>
          <Button variant="primary" @click="router.push('/users')">查看用户</Button>
        </template>
      </Card>
      
      <Card class="card">
        <template #header>
          <h3>商品管理</h3>
        </template>
        <p>管理系统商品，包括添加、编辑、删除商品等功能。</p>
        <template #footer>
          <Button variant="secondary" @click="router.push('/products')">查看商品</Button>
        </template>
      </Card>
      
      <Card class="card">
        <template #header>
          <h3>订单管理</h3>
        </template>
        <p>管理系统订单，包括查看订单详情、更新订单状态等功能。</p>
        <template #footer>
          <Button variant="info" @click="router.push('/orders')">查看订单</Button>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Card, Button } from '../components';

const router = useRouter();
</script>

<style scoped lang="scss">
.home {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  
  h1 {
    font-size: 2.5rem;
    color: #343a40;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 1.2rem;
    color: #6c757d;
    margin-bottom: 32px;
  }
  
  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    
    .card {
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
      }
    }
  }
}
</style>
