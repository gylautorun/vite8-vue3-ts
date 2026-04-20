import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    autoprefixer({
      // 适配的浏览器范围（规范，覆盖 95% 以上用户）
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'iOS >= 14',
        'Android >= 10'
      ]
    })
  ]
};
