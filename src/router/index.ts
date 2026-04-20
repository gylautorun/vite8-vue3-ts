import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// 配置 NProgress
NProgress.configure({
  easing: 'ease',
  speed: 500,
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3
});

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: '关于我们'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '用户登录'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: {
      title: '用户注册'
    }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('../views/Users.vue'),
    meta: {
      title: '用户管理'
    }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views/Products.vue'),
    meta: {
      title: '商品管理'
    }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../views/Orders.vue'),
    meta: {
      title: '订单管理'
    }
  },
  // 通过 meta 字段设置以下属性
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: {
      title: '管理后台',
      requiresAuth: true,  // 需要登录
      roles: ['admin'],    // 需要的角色
      permissions: ['user:read', 'user:write']  // 需要的权限

      /**
       * 模拟登录: 控制台执行以下代码来模拟登录
       * localStorage.setItem('token', 'mock-token');
       * localStorage.setItem('userRoles', '["admin"]');
       * localStorage.setItem('userPermissions', '["user:read", "user:write"]');
       */
    }
  },
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '页面不存在'
    }
  }
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

/**
 * beforeEach 路由守卫 ：
  - 进度条管理 ：路由跳转开始时显示进度条
  - 页面标题设置 ：根据路由 meta 信息动态设置页面标题
  - 登录验证 ：检查 token，未登录用户访问需要权限的页面时跳转到登录页
  - 已登录用户处理 ：已登录用户访问登录页时自动跳转到首页
  - 角色权限验证 ：检查用户是否具有访问路由所需的角色权限
  - 权限验证 ：检查用户是否具有访问路由所需的特定权限
  - 开发环境日志 ：在开发环境记录路由跳转日志
 */
router.beforeEach((to, _from, next) => {
  // 开始进度条
  NProgress.start();
  
  // 设置页面标题
  document.title = to.meta.title as string || 'Vue 3 + Vite 8';
  
  // 权限验证
  const token = localStorage.getItem('token');
  const requiresAuth = to.meta.requiresAuth as boolean;
  
  // 如果需要登录验证且没有 token，跳转到登录页
  if (requiresAuth && !token) {
    NProgress.done();
    next('/login');
    return;
  }
  
  // 如果已登录且访问登录页，跳转到首页
  if (token && to.path === '/login') {
    NProgress.done();
    next('/');
    return;
  }
  
  // 检查路由是否需要特定角色权限
  const requiredRoles = to.meta.roles as string[];
  if (requiredRoles && requiredRoles.length > 0) {
    const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    const hasPermission = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasPermission) {
      NProgress.done();
      next('/403');
      return;
    }
  }
  
  // 检查路由是否需要特定权限
  const requiredPermissions = to.meta.permissions as string[];
  if (requiredPermissions && requiredPermissions.length > 0) {
    const userPermissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
    const hasPermission = requiredPermissions.some(permission => userPermissions.includes(permission));
    
    if (!hasPermission) {
      NProgress.done();
      next('/403');
      return;
    }
  }
  
  // 记录路由跳转日志（开发环境）
  if (import.meta.env.DEV) {
    console.log(`[Router] Navigating from ${_from.path} to ${to.path}`);
  }
  
  next();
});

/**
 * afterEach 路由守卫 ：
  - 进度条管理 ：路由跳转完成后隐藏进度条
  - 页面滚动 ：自动滚动到页面顶部
  - 开发环境日志 ：在开发环境记录路由跳转完成日志
 */
router.afterEach((to, _from) => {
  // 结束进度条
  NProgress.done();
  
  // 滚动到页面顶部
  window.scrollTo(0, 0);
  
  // 记录路由跳转完成日志（开发环境）
  if (import.meta.env.DEV) {
    console.log(`[Router] Navigation completed to ${to.path}`);
  }
});

/**
 * onError 错误处理 ：
   - 进度条管理 ：发生错误时隐藏进度条
   - 错误日志 ：记录路由导航错误
   - ChunkLoadError 处理 ：懒加载失败时提示用户刷新页面
   - NavigationDuplicated 处理 ：忽略重复导航错误
   - 其他错误处理 ：跳转到错误页面
 */
router.onError((error) => {
  // 结束进度条
  NProgress.done();
  
  // 记录错误日志
  console.error('[Router] Navigation error:', error);
  
  // 根据错误类型进行不同的处理
  if (error.name === 'ChunkLoadError') {
    // 懒加载失败，提示用户刷新页面
    alert('页面加载失败，请刷新页面重试');
    window.location.reload();
  } else if (error.name === 'NavigationDuplicated') {
    // 重复导航，忽略
    console.warn('[Router] Duplicate navigation detected');
  } else {
    // 其他错误，跳转到错误页面
    window.location.href = '/error';
  }
});

export default router;
