<template>
  <button
    class="button"
    :class="[
      `button--${variant}`,
      `button--${size}`,
      { 'button--disabled': disabled },
      { 'button--loading': loading },
      className
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="button__loading">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="44" stroke-dashoffset="44">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 8 8"
            to="360 8 8"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </span>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineProps({
  // 按钮类型
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => ['primary', 'secondary', 'danger', 'warning', 'info'].includes(value)
  },
  // 按钮大小
  size: {
    type: String,
    default: 'medium',
    validator: (value: string) => ['small', 'medium', 'large'].includes(value)
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 是否加载中
  loading: {
    type: Boolean,
    default: false
  },
  // 自定义类名
  className: {
    type: String,
    default: ''
  }
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>();

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<style scoped lang="scss">
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled):not(.button--loading) {
    opacity: 0.9;
  }
  
  &:active:not(:disabled):not(.button--loading) {
    transform: translateY(1px);
  }
  
  &:disabled,
  &.button--disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &.button--loading {
    cursor: wait;
  }
  
  &__loading {
    animation: spin 1s linear infinite;
  }
  
  // 变体样式
  &--primary {
    background-color: #3498db;
    color: white;
  }
  
  &--secondary {
    background-color: #2ecc71;
    color: white;
  }
  
  &--danger {
    background-color: #e74c3c;
    color: white;
  }
  
  &--warning {
    background-color: #f39c12;
    color: white;
  }
  
  &--info {
    background-color: #17a2b8;
    color: white;
  }
  
  // 大小样式
  &--small {
    padding: 4px 12px;
    font-size: 12px;
  }
  
  &--medium {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  &--large {
    padding: 12px 24px;
    font-size: 16px;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
