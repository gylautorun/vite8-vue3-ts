# Vue 3 + TypeScript + Vite 8

这是一个使用 Vue 3、TypeScript 和 Vite 8 构建的前端项目模板，提供了现代化的开发环境和最佳实践配置。

## 技术栈

- **框架**：Vue 3
- **语言**：TypeScript
- **构建工具**：Vite 8
- **状态管理**：Pinia
- **路由**：Vue Router
- **网络请求**：Axios
- **CSS 预处理器**：Sass
- **代码规范**：ESLint + Prettier
- **样式规范**：StyleLint

## 项目结构

```
├── public/          # 静态资源
├── src/             # 源代码
│   ├── assets/      # 资源文件
│   ├── components/  # 组件
│   ├── utils/       # 工具函数
│   ├── api/         # 接口请求
│   ├── types/       # TypeScript 类型
│   ├── store/       # Pinia 状态管理
│   ├── router/      # 路由配置
│   ├── App.vue      # 根组件
│   ├── main.ts      # 入口文件
│   └── vite-env.d.ts # Vite 类型声明
├── .gitignore       # Git 忽略配置
├── eslint.config.js # ESLint 配置
├── .prettierrc.json # Prettier 配置
├── index.html       # HTML 模板
├── package.json     # 项目依赖
├── tsconfig.json    # TypeScript 配置
└── vite.config.ts   # Vite 配置
```

## 开发环境设置

### 环境要求

- Node.js 20.19+ 或 22.12+
- npm 9+

### 安装依赖

```bash
npm install --legacy-peer-deps
```

### 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:5173` 启动。

## 构建和部署

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录中。

### 预览生产构建

```bash
npm run preview
```

预览服务器将在 `http://localhost:5174` 启动。

## 代码规范

项目使用 ESLint 和 Prettier 进行代码规范检查和格式化。

### 运行 ESLint 检查

```bash
npm run lint
```

### 自动修复 ESLint 错误

```bash
npm run lint -- --fix
```

## 配置说明

### Vite 配置

项目使用 Vite 8，配置文件为 `vite.config.ts`，包含以下主要配置：

- 开发服务器配置（端口、代理、热更新等）
- 构建配置（输出目录、压缩、代码分割等）
- 路径别名配置（@ 指向 src 目录）
- 插件配置（Vue、JSX、StyleLint、SVG 加载等）
- CSS 配置（模块化、预处理器、后处理器等）
- 环境变量配置
- 依赖优化配置

### TypeScript 配置

项目使用 TypeScript，配置文件为 `tsconfig.json`，包含以下主要配置：

- 编译选项（目标、模块、严格模式等）
- 包含和排除文件
- 路径映射

## 常见问题

### 依赖冲突

如果遇到依赖冲突，可以使用 `--legacy-peer-deps` 标志安装依赖：

```bash
npm install --legacy-peer-deps
```

### 构建错误

如果遇到构建错误，可以检查以下几点：

1. 确保所有依赖都已正确安装
2. 确保 TypeScript 类型检查通过
3. 确保 ESLint 检查通过
4. 检查 Vite 配置是否正确

### 开发服务器启动错误

如果遇到开发服务器启动错误，可以检查以下几点：

1. 确保端口 5173 未被占用
2. 确保依赖都已正确安装
3. 检查 Vite 配置是否正确

## 许可证

MIT
