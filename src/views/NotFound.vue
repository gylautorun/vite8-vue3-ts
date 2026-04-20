<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>页面不存在</h2>
    <p>抱歉，您访问的页面不存在或已被删除。</p>
    <Button variant="primary" @click="router.push('/')">返回首页</Button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Button } from '../components';

const router = useRouter();
</script>

<style scoped lang="scss">
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  
  h1 {
    font-size: 6rem;
    font-weight: 700;
    color: #343a40;
    margin: 0;
  }
  
  h2 {
    font-size: 2rem;
    color: #343a40;
    margin: 16px 0;
  }
  
  p {
    font-size: 1.2rem;
    color: #6c757d;
    margin-bottom: 32px;
    max-width: 500px;
  }
}
</style>
