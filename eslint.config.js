import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import prettierConfig from 'eslint-config-prettier'
import vueEslintParser from 'vue-eslint-parser'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '*.log', 'env.console.ts']
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  prettierConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parser: tseslint.parser
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      'no-prototype-builtins': 'off',

      // 逗号自动修复
      'comma-dangle': ['error', 'never'],
      'comma-style': ['error', 'last']
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parser: vueEslintParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      vue,
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',

      // 逗号自动修复
      'comma-dangle': ['error', 'never'],
      'comma-style': ['error', 'last']
    }
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'no-console': 'off',
      'no-prototype-builtins': 'off',

      // 逗号自动修复
      'comma-dangle': ['error', 'never'],
      'comma-style': ['error', 'last']
    }
  }
]