# Vite 8 新特性与配置指南

本文档整理了 Vite 8 的核心新特性、配置要点和最佳实践，帮助开发者快速上手 Vite 8 并充分利用其性能优势。

## 一、Vite 8 核心新特性

### 1.1 统一使用 Rolldown 打包器

Vite 8 放弃了之前的双引擎架构（开发用 esbuild，生产用 Rollup），统一使用 Rolldown 作为打包器。

**Rolldown 优势**：

- **性能提升**：Rust 编写，比 Rollup 快 10-30 倍，比 esbuild 还快将近 2 倍
- **内存占用低**：GitLab 报告内存占用降低了 100 倍
- **行为一致性**：开发和生产环境使用同一打包器，避免了之前的行为不一致问题
- **生态兼容**：兼容 Rollup 插件生态

**真实项目数据**：

| 项目       | 构建时间变化  | 提升倍数 |
| ---------- | ------------- | -------- |
| Linear     | 46s → 6s     | 7.6x     |
| Excalidraw | 22.9s → 1.4s | 16x      |
| GitLab     | 2.5min → 40s | 3.75x    |
| Beehiiv    | -64% 更快     | -        |

### 1.2 默认压缩器变更

#### JavaScript 压缩器

- **旧版本**：默认使用 esbuild
- **Vite 8**：默认使用 Oxc（Rust 编写），比 esbuild 更快，压缩率接近
- **可选配置**：仍可手动指定为 'esbuild'（已弃用）或 'terser'（需额外安装）

#### CSS 压缩器

- **旧版本**：默认使用 esbuild
- **Vite 8**：默认使用 LightningCSS
- **可选配置**：可通过 `build.cssMinify: 'esbuild'` 切换回 esbuild

### 1.3 配置项变更

#### 代码分割

- **旧版本**：使用 `manualChunks`
- **Vite 8**：推荐使用 `codeSplitting` 替代 `manualChunks`

#### 配置项重命名

- `build.rollupOptions` 将来会改为 `build.rolldownOptions`（目前仍兼容但会有警告）

### 1.4 开发服务器优化

Vite 8 对开发服务器进行了优化，未来还将推出 Full Bundle Mode，预计：

- 启动快 3 倍
- 热更新快 40%
- 网络请求少 10 倍

### 1.5 环境要求

- Node.js 版本要求：20.19+ 或 22.12+（18 不支持）

## 二、Vite 8 核心配置

### 2.1 基础配置

```typescript
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

const resolve = (dir: string) => path.resolve(__dirname, dir);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '.env'), '');
  
  return {
    // 项目根目录
    root: process.cwd(),
  
    // 开发服务器配置
    server: {
      port: Number(env.VITE_PORT) || 5173,
      open: true,
      host: '0.0.0.0',
      hmr: {
        exclude: ['node_modules/**/*'],
        timeout: 3000,
      },
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false,
        },
      },
      // 开发环境缓存（Vite 8 新增）
      cacheDir: path.resolve(__dirname, 'node_modules/.vite/cache'),
    },
  
    // 构建配置
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      target: 'es2020',
      // Vite 8 默认使用 Oxc 作为 JavaScript 压缩器
      minify: 'oxc',
      sourcemap: false,
      assetsInlineLimit: 4096,
      // Vite 8 推荐使用 codeSplitting 替代 manualChunks
      rollupOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: 'vue',
                test: /[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/
              },
              {
                name: 'axios',
                test: /[\\/]node_modules[\\/](axios)[\\/]/
              },
              {
                name: 'utils',
                test: /[\\/]node_modules[\\/](lodash-es|date-fns)[\\/]/
              }
            ]
          },
          assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
        },
      },
      emptyOutDir: true,
      compression: {
        enabled: true,
        algorithm: 'gzip',
        threshold: 10240,
      },
      cssCodeSplit: true,
    },
  
    // 路径别名配置
    resolve: {
      alias: {
        '@': resolve('src'),
        '@/components': resolve('src/components'),
        '@/utils': resolve('src/utils'),
        '@/api': resolve('src/api'),
        '@/types': resolve('src/types'),
        '@/assets': resolve('src/assets'),
        '@/store': resolve('src/store'),
        '@/router': resolve('src/router'),
      },
      extensions: ['.ts', '.tsx', '.vue', '.js', '.jsx', '.json', '.scss'],
    },
  
    // 插件配置
    plugins: [
      vue(),
      // 其他插件...
    ],
  
    // CSS 配置
    css: {
      modules: {
        generateScopedName: '[name]-[local]-[hash:8]',
        localsConvention: 'camelCaseOnly',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/assets/scss/variables.scss";
            @import "@/assets/scss/mixins.scss";
          `,
          includePaths: [resolve('src/assets/scss')],
        },
      },
      devSourcemap: mode === 'development',
    },
  
    // 环境变量配置
    envDir: resolve('./.env'),
    envPrefix: 'VITE_',
  
    // 优化配置（Vite 8 新增）
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'axios', 'lodash-es'],
      exclude: ['vue-demi'],
      cacheDir: resolve('node_modules/.vite/optimize-deps'),
      force: mode === 'development',
    },
  
    // 预览配置
    preview: {
      port: 5174,
      open: true,
      host: '0.0.0.0',
    }
  }
});
```

### 2.2 关键配置变更

#### 2.2.1 代码分割配置

**旧写法（Vite 7）**：

```typescript
manualChunks: {
  vue: ['vue', 'vue-router', 'pinia'],
  axios: ['axios'],
  utils: ['lodash-es', 'date-fns'],
}
```

**新写法（Vite 8）**：

```typescript
codeSplitting: {
  groups: [
    {
      name: 'vue',
      test: /[\\/]node_modules[\\/](vue|vue-router|pinia)[\\/]/
    },
    {
      name: 'axios',
      test: /[\\/]node_modules[\\/](axios)[\\/]/
    },
    {
      name: 'utils',
      test: /[\\/]node_modules[\\/](lodash-es|date-fns)[\\/]/
    }
  ]
}
```

#### 2.2.2 压缩器配置

**Vite 7**：

```typescript
minify: 'esbuild',
```

**Vite 8**：

```typescript
minify: 'oxc', // 默认，可省略
// minify: 'esbuild', // 旧版兼容（已弃用）
// minify: 'terser', // 高压缩率（需额外安装）
```

## 三、Vite 8 性能优化

### 3.1 依赖优化

1. **预构建依赖**：使用 `optimizeDeps` 配置，将常用第三方依赖提前构建，提升冷启动速度
2. **缓存策略**：利用 Vite 8 新增的缓存机制，提升二次启动速度
3. **依赖分割**：合理配置 `codeSplitting`，优化浏览器缓存

### 3.2 构建优化

1. **压缩配置**：使用默认的 Oxc 压缩器，获得最佳性能
2. **资源内联**：合理设置 `assetsInlineLimit`，平衡 HTTP 请求次数和文件体积
3. **代码分割**：利用 `codeSplitting` 配置，优化首屏加载速度
4. **Gzip 压缩**：开启 `compression` 配置，减小文件体积

### 3.3 开发环境优化

1. **热更新配置**：合理配置 `hmr`，提升热更新速度
2. **缓存目录**：使用 `cacheDir` 配置，提升冷启动速度
3. **代理配置**：优化 `proxy` 配置，解决跨域问题

## 四、Vite 8 兼容性问题

### 4.1 依赖兼容性

- **@vitejs/plugin-vue**：需要使用兼容 Vite 8 的版本
- **其他 Vite 插件**：大部分直接可用，少数依赖 esbuild 特定选项的需要适配

### 4.2 配置兼容性

- **manualChunks**：已弃用，推荐使用 `codeSplitting`
- **build.rollupOptions**：将来会改为 `build.rolldownOptions`

### 4.3 Node.js 版本要求

- 必须使用 Node.js 20.19+ 或 22.12+，不支持 Node.js 18

## 五、Vite 8 最佳实践

### 5.1 项目初始化

```bash
# 使用 Vite 8 初始化 Vue 3 + TypeScript 项目
npm create vite@latest my-project -- --template vue-ts

# 进入项目目录
cd my-project

# 安装依赖
npm install --legacy-peer-deps

# 启动开发服务器
npm run dev
```

### 5.2 配置建议

1. **使用 TypeScript**：充分利用 TypeScript 的类型系统，提升代码质量
2. **合理配置路径别名**：简化导入路径，提升代码可读性
3. **使用 ESLint 和 Prettier**：保持代码规范和一致性
4. **合理配置代码分割**：优化首屏加载速度和浏览器缓存
5. **使用环境变量**：区分开发、测试、生产环境配置

### 5.3 常见问题解决

1. **依赖冲突**：使用 `--legacy-peer-deps` 安装依赖
2. **构建错误**：检查 TypeScript 类型检查和 ESLint 检查
3. **开发服务器启动错误**：检查端口是否被占用，依赖是否正确安装

## 六、常见问题与解决方案

### 6.1 初始化配置问题

**问题**：如何初始化 Vite 8 + React + TypeScript 项目？

**解决方案**：

```bash
# 使用 Vite 8 初始化 React + TypeScript 项目
npm create vite@latest my-project -- --template react-ts

# 进入项目目录
cd my-project

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 6.2 框架切换问题

**问题**：如何将 React 项目切换为 Vue 3 项目？

**解决方案**：

1. 修改 package.json 文件，将 React 相关依赖替换为 Vue 3 相关依赖
2. 修改 vite.config.ts 文件，使用 Vue 插件替代 React 插件
3. 修改 tsconfig.app.json 文件，添加 Vue 相关的类型支持
4. 删除 React 相关文件，创建 Vue 3 相关文件
5. 修改 index.html 文件，将 React 相关的内容替换为 Vue 3 相关的内容
6. 安装依赖并构建项目

### 6.3 TypeScript 类型错误

**问题**：vite-env.d.ts 文件报错

**解决方案**：
修改 vite-env.d.ts 文件，将 `DefineComponent<{}, {}, any>` 改为 `DefineComponent`，使用更现代的 Vue 3 类型定义方式：

```typescript
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}
```

### 6.4 依赖补全问题

**问题**：如何根据 vite.config.ts 配置补全依赖？

**解决方案**：

1. 安装 Vue 3 相关的依赖：@vitejs/plugin-vue、@vitejs/plugin-vue-jsx、vue、vue-router、pinia
2. 安装 Vite 插件：rollup-plugin-visualizer、vite-plugin-eslint、vite-plugin-stylelint、vite-svg-loader、vite-plugin-compression、vite-plugin-html
3. 安装其他必要的依赖：autoprefixer、sass、stylelint、axios、lodash-es、esbuild
4. 修复配置文件中的错误，确保所有依赖都能正确使用

### 6.5 压缩器配置问题

**问题**：Vite 8 的默认压缩器是什么？

**解决方案**：

- Vite 8 默认使用 Oxc 作为 JavaScript 压缩器（Rust 编写），比 esbuild 更快，压缩率接近
- Vite 8 默认使用 LightningCSS 作为 CSS 压缩器
- 可通过以下配置手动指定压缩器：

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'oxc', // 默认，可省略
    // minify: 'esbuild', // 旧版兼容（已弃用）
    // minify: 'terser', // 高压缩率（需额外安装）
    // minify: false, // 不压缩
  }
})
```

### 6.6 ESLint 配置问题

**问题**：为什么不能使用 eslintPlugin？

**解决方案**：

- 原因：vite-plugin-eslint 在处理 Vue 单文件组件时可能会遇到解析错误
- 替代方案：
  1. 使用单独的 ESLint 配置文件（.eslintrc.js 或 eslint.config.js）
  2. 在开发环境中使用 IDE 的 ESLint 插件进行实时检查
  3. 在构建脚本中添加单独的 ESLint 检查步骤

### 6.7 Git 忽略配置问题

**问题**：.gitignore 文件没有作用

**解决方案**：

- 确保项目已经初始化了 git 仓库：`git init`
- 检查 .gitignore 文件的内容，确保包含了需要忽略的文件和目录：

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist/
dist-ssr/
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

### 6.8 PostCSS 配置问题

**问题**：如何配置 PostCSS 和 Autoprefixer？

**解决方案**：

1. 安装必要的依赖：autoprefixer、postcss
2. 创建 postcss.config.js 文件：

```javascript
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    autoprefixer({
      // 适配的浏览器范围（规范，覆盖 95% 以上用户）
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'iOS >= 14',
        'Android >= 10',
      ],
    }),
  ],
};
```

3. 从 vite.config.ts 文件中移除 postcss 配置，使用单独的 postcss.config.js 文件

## 七、总结

Vite 8 是一个重大的版本更新，带来了显著的性能提升和架构改进。通过统一使用 Rolldown 打包器、默认使用 Oxc 压缩器、优化开发服务器等措施，Vite 8 在构建速度、内存占用和开发体验方面都有了很大的提升。

对于新项目，建议直接使用 Vite 8；对于现有项目，可以考虑升级到 Vite 8，享受其性能优势。在升级过程中，需要注意配置项的变更和依赖的兼容性问题，确保项目能够平稳过渡。

Vite 8 的推出标志着前端构建工具的又一次重大进步，为前端开发者提供了更快、更稳定、更高效的构建体验。

通过本文档的介绍，希望能够帮助开发者快速上手 Vite 8，并充分利用其性能优势，构建更好的前端项目。
