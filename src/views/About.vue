<template>
  <div class="about">
    <h1>关于我们</h1>
    <p>这是一个使用 Vue 3 + Vite 8 + TypeScript 构建的示例应用。</p>
    
    <div class="features">
      <Card class="feature-card">
        <template #header>
          <h3>Vue 3</h3>
        </template>
        <p>使用最新的 Vue 3 Composition API，提供更好的代码组织和逻辑复用。</p>
      </Card>
      
      <Card class="feature-card">
        <template #header>
          <h3>Vite 8</h3>
        </template>
        <p>使用 Vite 8 作为构建工具，提供更快的开发体验和构建速度。</p>
      </Card>
      
      <Card class="feature-card">
        <template #header>
          <h3>TypeScript</h3>
        </template>
        <p>使用 TypeScript 提供类型安全，减少运行时错误。</p>
      </Card>
      
      <Card class="feature-card">
        <template #header>
          <h3>Pinia</h3>
        </template>
        <p>使用 Pinia 进行状态管理，提供更简洁的 API 和更好的 TypeScript 支持。</p>
      </Card>
      
      <Card class="feature-card">
        <template #header>
          <h3>Vue Router</h3>
        </template>
        <p>使用 Vue Router 进行路由管理，提供客户端路由功能。</p>
      </Card>
      
      <Card class="feature-card">
        <template #header>
          <h3>Axios</h3>
        </template>
        <p>使用 Axios 进行 HTTP 请求，提供统一的 API 调用方式。</p>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card } from '../components';
</script>

<style scoped lang="scss">
.about {
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
  
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    
    .feature-card {
      transition: transform 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
      }
    }
  }
}
</style>
