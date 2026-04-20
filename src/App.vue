<template>
  <div class="app">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="container">
        <div class="navbar-brand">
          <a href="/">Vue 3 + Vite 8</a>
        </div>
        <div class="navbar-links">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/about" class="nav-link">关于我们</router-link>
          <router-link to="/users" class="nav-link">用户管理</router-link>
          <router-link to="/products" class="nav-link">商品管理</router-link>
          <router-link to="/orders" class="nav-link">订单管理</router-link>
          <router-link to="/admin" class="nav-link">管理后台</router-link>
        </div>
      </div>
    </nav>
    
    <!-- 路由出口 -->
    <main class="main">
      <router-view />
    </main>
    
    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Vue 3 + Vite 8 示例应用</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Vue 3 Composition API with TypeScript
</script>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  background-color: #343a40;
  color: white;
  padding: 16px 0;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
  }
  
  .navbar-brand {
    a {
      color: white;
      font-size: 1.5rem;
      font-weight: 700;
      text-decoration: none;
    }
  }
  
  .navbar-links {
    display: flex;
    gap: 20px;
    
    .nav-link {
      color: rgba(255, 255, 255, 0.75);
      text-decoration: none;
      font-size: 1rem;
      font-weight: 500;
      transition: color 0.3s ease;
      
      &:hover {
        color: white;
      }
      
      &.router-link-active {
        color: white;
        border-bottom: 2px solid #3498db;
      }
    }
  }
}

.main {
  flex: 1;
  padding: 20px 0;
}

.footer {
  background-color: #f8f9fa;
  padding: 20px 0;
  margin-top: 40px;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    padding: 0 20px;
    
    p {
      margin: 0;
      color: #6c757d;
      font-size: 0.875rem;
    }
  }
}
</style>

