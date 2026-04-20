<template>
  <div class="card" :class="[className]">
    <div v-if="title" class="card__header">
      <h3 class="card__title">{{ title }}</h3>
      <slot name="header"></slot>
    </div>
    <div class="card__body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  // 卡片标题
  title: {
    type: String,
    default: ''
  },
  // 自定义类名
  className: {
    type: String,
    default: ''
  }
});
</script>

<style scoped lang="scss">
.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
  
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    border-bottom: 1px solid #e9ecef;
  }
  
  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #343a40;
  }
  
  &__body {
    padding: 16px;
  }
  
  &__footer {
    padding: 16px;
    border-top: 1px solid #e9ecef;
    background-color: #f8f9fa;
  }
}
</style>
