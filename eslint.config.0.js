import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{ts,tsx,vue}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      ...vue.configs['flat/recommended'],
      'eslint:recommended',
      'plugin:vue/vue3-recommended',
      'prettier',
      prettierConfig
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    plugins: {
      vue,
      prettier
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prettier/prettier': 'error',
      // 自动补全逗号
      'comma-dangle': ['error', 'never'],
      'comma-style': ['error', 'last']
    }
  }
])
