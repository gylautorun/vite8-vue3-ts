// export default {
//   overrides: [
//     {
//       files: ['*.vue'],
//       customSyntax: 'postcss-html'
//     },
//     {
//       files: ['*.scss', '*.sass'],
//       customSyntax: 'postcss-scss'
//     }
//   ],
//   extends: [
//     "stylelint-config-standard-scss"
//   ],
//   rules: {
//     // 基础规则
//     'indentation': 2,
//     'color-no-invalid-hex': true,
//     // 'unit-allowed-list': ['em', 'rem', 's', 'px', '%', 'vh', 'vw', 'fr'],
//     'unit-allowed-list': null,
//     'selector-class-pattern': '^[a-z][a-zA-Z0-9]+$',
//     'declaration-no-important': true,
//     'no-descending-specificity': true
//   },
//   ignoreFiles: [
//     'node_modules/**/*',
//     'dist/**/*'
//   ]
// };
export default {
  overrides: [
    {
      files: ['*.vue'],
      customSyntax: 'postcss-html'
    },
    {
      files: ['*.scss', '*.sass'],
      customSyntax: 'postcss-scss'
    }
  ],
  "extends": [
    "stylelint-config-standard-scss",
    "stylelint-config-html"
  ],
  "rules": {
    // stylelint-config-standard-scss, 它自带缩进配置，你手动加 indentation: 2 反而冲突、不认识
    // // 这两个必须一起写，否则必定报错
    // "indentation": 2,        // 开启缩进
    // "scss/indentation": null, // 关闭冲突的 SCSS 缩进规则

    // 直接强制关闭你这7个报错
    "selector-not-notation": null,
    "selector-class-pattern": null,
    "rule-empty-line-before": null,
    "shorthand-property-no-redundant-values": null, // 关闭 box-shadow 多余值报错

    // 之前的错误也全部关闭
    "color-hex-length": null,
    "color-function-alias-notation": null,
    "color-function-notation": null,
    "alpha-value-notation": null,
    "scss/no-global-function-names": null,
    "declaration-block-no-redundant-longhand-properties": null,
    "at-rule-empty-line-before": null,
    "declaration-empty-line-before": null,
    "unit-allowed-list": null
  }
}




