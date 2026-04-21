import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx'; // 支持 JSX/TSX（项目常用）
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer'; // 打包体积分析（优化必备）
import stylelintPlugin from 'vite-plugin-stylelint'; // 样式校验（规范 CSS/SCSS）
import svgLoader from 'vite-svg-loader'; // SVG 图标处理（组件化使用）
import compression from 'vite-plugin-compression'; // 生产环境压缩（提升加载速度）
import { createHtmlPlugin } from 'vite-plugin-html'; // HTML 模板处理（注入环境变量）

// 定义路径别名函数（简化配置，避免重复书写）
const resolve = (dir: string) => path.resolve(__dirname, dir);

// Vite 8 核心配置（适配 Vue3 + TypeScript 项目）
export default defineConfig(({ mode }) => {
  // 加载环境变量（区分开发/生产环境，envDir 指定环境变量目录）
  const env = loadEnv(mode, path.resolve(__dirname, '.env'), '');
  // console.log('当前环境：', env);
  // 可以看 env.console.ts 文件内容就是 env 对象的所有属性


  return {
    /* ========================== 基础配置 ========================== */
    // 项目根目录（默认当前目录，无需修改，规范路径）
    root: process.cwd(),
    // 开发服务器配置（核心，影响开发体验）
    server: {
      // 开发环境端口（项目建议避开 80、443 等常用端口，防止冲突）
      port: Number(env.VITE_PORT) || 5173,
      // 自动打开浏览器（开发时便捷，生产环境不生效）
      open: true,
      // 允许外部访问（团队协作时，其他设备可通过 IP 访问本地项目）
      host: '0.0.0.0',
      // 热更新配置（Vite 8 新增优化，提升热更新速度）
      hmr: {
        // 禁用热更新的文件（避免敏感文件更新导致页面刷新）
        exclude: ['node_modules/**/*', 'server/**/*'],
        // 热更新超时时间（防止网络差导致热更新失败）
        timeout: 3000
      },
      // 跨域配置（项目必配，解决前端跨域请求后端接口问题）
      proxy: {
        // 匹配接口前缀（根据后端接口规范调整，示例：/api 开头的接口）
        '/api': {
          // 后端接口基础地址（从环境变量读取，区分开发/测试/生产）
          target: env.VITE_API_BASE_URL,
          // 允许跨域（开启后，前端请求会携带当前域名的 Cookie）
          changeOrigin: true,
          // 路径重写（如果后端接口没有 /api 前缀，需要去掉，反之则注释）
          rewrite: (path) => path.replace(/^\/api/, ''),
          // 禁用 SSL 证书校验（开发环境使用，生产环境建议开启）
          secure: false
        },
        // 可配置多个跨域规则（如对接多个后端服务）
        '/third-api': {
          target: env.VITE_THIRD_API_BASE_URL,
          changeOrigin: true,
          secure: false
        }
      },
      // 开发环境缓存（Vite 8 新增，提升冷启动速度）
      cacheDir: path.resolve(__dirname, 'node_modules/.vite/cache')
    },

    /* ========================== 构建配置（生产环境） ========================== */
    build: {
      // 打包输出目录（规范，默认 dist，无需修改）
      outDir: 'dist',
      // 静态资源输出目录（规范静态资源路径，便于 CDN 部署）
      assetsDir: 'assets',
      // 打包目标（适配现代浏览器，提升打包效率和产物性能）
      target: 'es2020',
      // 压缩配置（生产环境必开，减小打包体积）
      minify: 'oxc', // Vite 8 默认 JavaScript 压缩器为 Oxc（Rust 编写），比 esbuild 更快，压缩率接近；CSS 压缩器默认为 LightningCSS
      // 取消生产环境 sourceMap（避免暴露源码，提升安全性，调试时可临时开启）
      sourcemap: false,
      // 静态资源体积限制（超过该大小的资源会单独打包，单位：kb）
      assetsInlineLimit: 4096, // 4kb，常用配置
      //  chunk 分割策略（优化打包体积，避免单个文件过大）
      rollupOptions: {
        output: {
          // 拆分第三方依赖（如 vue、axios 等，单独打包，便于浏览器缓存）
          // Vite 8 使用 Rolldown，推荐使用 codeSplitting 替代 manualChunks
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
          // 静态资源命名规则（规范命名，便于版本管理和缓存）
          // assetFileNames: {
          //   js: 'assets/js/[name].[hash].js',
          //   css: 'assets/css/[name].[hash].css',
          //   img: 'assets/img/[name].[hash].[ext]',
          //   svg: 'assets/svg/[name].[hash].[ext]',
          //   font: 'assets/font/[name].[hash].[ext]',
          // },
          assetFileNames: 'assets/[ext]/[name].[hash].[ext]'
        }
      },
      // 打包时删除输出目录（避免旧产物残留，规范）
      emptyOutDir: true,
      // 开启打包压缩（进一步减小体积，可选 gzip 或 brotli）
      compression: {
        enabled: true,
        algorithm: 'gzip',
        threshold: 10240 // 超过 10kb 的文件才压缩
      },
      // 禁用 CSS 代码拆分（如果项目需要将所有 CSS 合并为一个文件，开启此项）
      cssCodeSplit: true
    },

    /* ========================== 路径别名配置（工程化必备） ========================== */
    resolve: {
      // 路径别名（解决长相对路径问题，与 tsconfig.json 保持一致）
      alias: {
        '@': resolve('src'), // 核心别名：@ 指向 src 根目录（标准）
        '@/components': resolve('src/components'), // 组件目录
        '@/utils': resolve('src/utils'), // 工具函数目录
        '@/style': resolve('src/style'), // 样式目录
        '@/api': resolve('src/api'), // 接口请求目录
        '@/types': resolve('src/types'), // TypeScript 类型声明目录
        '@/assets': resolve('src/assets'), // 静态资源目录
        '@/store': resolve('src/store'), // 状态管理目录（Pinia）
        '@/router': resolve('src/router') // 路由目录
      },
      // 省略文件后缀（简化导入，常用配置）
      extensions: ['.ts', '.tsx', '.vue', '.js', '.jsx', '.json', '.scss']
    },

    /* ========================== 插件配置（核心） ========================== */
    plugins: [
      // Vue 插件（必配，解析 .vue 文件）
      vue(),
      // JSX/TSX 插件（支持 JSX 语法，如需要可开启）
      vueJsx(),

      // StyleLint 插件（校验 CSS/SCSS 语法规范）
      stylelintPlugin({
        // include: ['src/**/*.scss', 'src/**/*.css', 'src/**/*.vue'],
        include: ["**/*.{vue,css,scss,sass}"],
        cache: true
      }),
      // SVG 加载插件（支持 SVG 组件化，如 import Icon from './icon.svg?component'）
      // svgLoader({
      //   // 开启 SVG 压缩
      //   svgo: {
      //     plugins: [
      //       // 移除 SVG 中的无用属性
      //       { name: 'removeAttrs', params: { attrs: ['fill', 'stroke.*'] } },
      //     ],
      //   },
      // }),
      svgLoader(),
      // HTML 模板插件（注入环境变量到 HTML 中，如标题、接口地址）
      createHtmlPlugin({
        inject: {
          data: {
            // 页面标题（从环境变量读取，区分环境）
            title: env.VITE_APP_TITLE,
            // 注入接口基础地址（可选，便于 HTML 中直接使用）
            apiBaseUrl: env.VITE_API_BASE_URL
          }
        },
        // 压缩 HTML（生产环境开启）
        minify:
          mode === 'production'
            ? {
                removeComments: true, // 移除注释
                collapseWhitespace: true, // 折叠空白字符
                removeAttributeQuotes: true // 移除属性引号
              }
            : false
      }),
      // 打包体积分析插件（生产环境打包后生成体积分析报告，便于优化）
      mode === 'production' &&
        visualizer({
          open: true, // 打包完成后自动打开报告
          gzipSize: true, // 显示 gzip 压缩后的体积
          brotliSize: true, // 显示 brotli 压缩后的体积
          filename: 'dist/volume-analysis.html' // 报告生成路径
        }),
      // 生产环境压缩插件（生成 .gz 压缩文件，配合 Nginx 开启 gzip 加速）
      mode === 'production' &&
        compression({
          algorithm: 'gzip',
          ext: '.gz',
          threshold: 10240 // 10kb 以上才压缩
        })
    ],

    /* ========================== CSS 配置（规范） ========================== */
    css: {
      // 开启 CSS 模块化（组件内样式隔离，避免样式污染）
      modules: {
        // 模块化类名命名规则（规范，便于调试）
        generateScopedName: '[name]-[local]-[hash:8]',
        // 允许在 CSS 中使用 JS 变量（如 import './style.module.scss?module'）
        localsConvention: 'camelCaseOnly'
      },
      // CSS 预处理器配置（支持 SCSS/SASS，项目常用）
      preprocessorOptions: {
        scss: {
          // 全局注入 SCSS 变量/混合器（无需在每个组件中导入）
          // 注意：需要先创建对应的 SCSS 文件
          additionalData: `
            @use "@/style/variables.scss" as *;
            @use "@/style/mixins.scss" as *;
          `,
          // 解决 SCSS 导入路径问题
          includePaths: [resolve('src/style')]
        }
      },
      // CSS 后处理器配置（自动添加浏览器前缀，适配不同浏览器）
      // postcss: {
      //   plugins: [
      //     // require('autoprefixer')({
      //     //   // 适配的浏览器范围（规范，覆盖 95% 以上用户）
      //     //   overrideBrowserslist: [
      //     //     'last 2 versions',
      //     //     '> 1%',
      //     //     'iOS >= 14',
      //     //     'Android >= 10',
      //     //   ],
      //     // }),
      //     // 由于 ESM 模块系统，暂时移除 autoprefixer 配置
      //     // 后续可以通过单独的 postcss.config.js 文件配置
      //   ],
      // },
      // 禁止 CSS 内联（生产环境将 CSS 单独打包，便于缓存）
      devSourcemap: mode === 'development' // 开发环境开启 CSS SourceMap，便于调试
    },

    /* ========================== 环境变量配置 ========================== */
    // 环境变量目录（默认根目录，规范环境变量存放）
    envDir: resolve('./.env'),
    // 环境变量前缀（只有以 VITE_ 开头的变量才会被注入到前端）
    envPrefix: 'VITE_',

    /* ========================== 优化配置（Vite 8 新增） ========================== */
    optimizeDeps: {
      // 预构建依赖（将常用第三方依赖提前构建，提升冷启动速度）
      include: ['vue', 'vue-router', 'pinia', 'axios', 'lodash-es'],
      // 排除预构建的依赖（无需预构建的依赖，减少预构建时间）
      exclude: ['vue-demi'],
      // 预构建缓存目录（Vite 8 优化缓存策略，提升二次启动速度）
      cacheDir: resolve('node_modules/.vite/optimize-deps'),
      // 强制预构建（如果依赖更新，强制重新预构建）
      force: mode === 'development'
    },

    /* ========================== 预览配置（生产环境打包后预览） ========================== */
    preview: {
      port: 5174, // 预览端口（与开发端口区分，避免冲突）
      open: true, // 自动打开预览页面
      host: '0.0.0.0'
    }
  };
});
