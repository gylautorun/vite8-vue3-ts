<template>
  <div class="input-container" :class="[className]">
    <label v-if="label" class="input-label">{{ label }}</label>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :maxlength="maxlength"
      :minlength="minlength"
      :pattern="pattern"
      :name="name"
      :id="id"
      class="input"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <div v-if="error" class="input-error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  // 输入框类型
  type: {
    type: String,
    default: 'text',
    validator: (value: string) => ['text', 'password', 'email', 'number', 'tel', 'url'].includes(value)
  },
  // 绑定值
  modelValue: {
    type: String,
    default: ''
  },
  // 标签
  label: {
    type: String,
    default: ''
  },
  // 占位符
  placeholder: {
    type: String,
    default: ''
  },
  // 是否禁用
  disabled: {
    type: Boolean,
    default: false
  },
  // 是否只读
  readonly: {
    type: Boolean,
    default: false
  },
  // 是否必填
  required: {
    type: Boolean,
    default: false
  },
  // 最大长度
  maxlength: {
    type: [Number, String],
    default: undefined
  },
  // 最小长度
  minlength: {
    type: [Number, String],
    default: undefined
  },
  // 正则表达式
  pattern: {
    type: String,
    default: undefined
  },
  // 名称
  name: {
    type: String,
    default: ''
  },
  // ID
  id: {
    type: String,
    default: ''
  },
  // 错误信息
  error: {
    type: String,
    default: ''
  },
  // 自定义类名
  className: {
    type: String,
    default: ''
  }
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  emit('blur', event);
};
</script>

<style scoped lang="scss">
.input-container {
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.input-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #343a40;
}

.input {
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
  
  &:disabled,
  &:read-only {
    background-color: #f8f9fa;
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #6c757d;
  }
}

.input-error {
  margin-top: 4px;
  font-size: 12px;
  color: #e74c3c;
}
</style>
