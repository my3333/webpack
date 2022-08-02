## 学习参考文档 https://juejin.cn/post/6844904031240863758#heading-8

## 区分开发环境和生产环境
webpack.dev.js - 开发环境主要实现热更新，不要压缩袋吗，要完整的sourceMap
webpack.prod.js - 生产环境主要实现压缩袋吗、提取css文件、合理的sourceMap、分割代码，如要暗转的插件如下：
  `npm i -D  webpack-merge copy-webpack-plugin optimize-css-assets-webpack-plugin uglifyjs-webpack-plugin`

webpack-merge 合并配置
copy-webpack-plugin 拷贝静态资源
optimize-css-assets-webpack-plugin 压缩css
uglifyjs-webpack-plugin 压缩js
tip: webpack mode设置production的时候会自动压缩js代码。原则上不需要引入uglifyjs-webpack-plugin进行重复工作。但是optimize-css-assets-webpack-plugin压缩css的同时会破坏原有的js压缩，所以这里我们引入uglifyjs进行压缩



1.环境准备
安装node，安装node成功后npm也会安装成功
`node -v`
`npm -v`
安装webpack、webpack-cli
`npm install webpack webpack-cli -G`    // 全局，在任何目录下都可以访问到
`webpack -v`









去掉的一些配置：
require.resolve('style-loader'),
require.resolve('css-loader'),
require.resolve('sass-loader'),
{
  loader: 'postcss-loader',     // 这个配置视为了给css样式添加浏览器前缀
  options: {
    plugins: [ require('autoprefixer') ]
  }
}  // loader会从右向左(或从下到上)解析



DeprecationWarning: [hash] is now [fullhash] (also consider using [chunkhash] or [contenthash], see documentation for details)
----------
anwser:
The deprecation notice is about to use [contenthash] as output filename. Just about:
// ...
output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: utils.isProd() ? '[name].[contenthash].js' : '[name].js',
    // ...
},
------------



"webpack --config build/webpack.config.js"
webpack --config NODE_ENV=development webpack-dev-server --open --mode development
