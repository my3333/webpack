const path = require('path');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');  // 帮助将打包出来的js文件引用到html中
const { CleanWebpackPlugin } = require('clean-webpack-plugin');   // 帮助在打包文件输出前将目标文件夹清空，这样文件夹下就只有该次打包输出的文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');   // 用于将css拆分出来，用外链的形式引入css文件;但是该插件会将所有的css样式合并为一个css文件。
// const ExtracttextWebpackPlugin = require('extract-text-webpack-plugin');  // 用于将样式拆分为一一对应的多个css文件
const vueLoaderPlugin = require('vue-loader/lib/plugin');   // vue-template-compiler用于编译模板


module.exports = {
  watch: true,

  // entry: path.resolve(__dirname, '../src/main.js'),   // 单入口
  // entry: ["@babel/polyfill", path.resolve(__dirname,'../src/main.js')],
  entry: {   // 多入口
    main: path.resolve(__dirname, '../src/main.js'),    // 需要使用绝对路径
    base: path.resolve(__dirname, '../src/base.js'),

    index: {
      import: './src/index.js',
      dependOn: 'shared'    // 表示这个是是共享的
    },
    shared: 'loadsh'   // 这个共享的文件会被单独打成一个bundle
  },
  output: {
    filename: 'scripts/[name].[contenthash].js',    // [name]  可以拿到entry入口的名字。实际开发中通常这样配置输出文件名称。为了缓存，每次打出来的文件的hash值都不同。 contenthash根据文件内容生成hash值
    path: path.resolve(__dirname, '../dist'),
    // 打包时将上次的打包内容清理掉
    clean: true,
    publicPath: 'http://localhost:8080/',   // 自定义（项目域名、CDN域名等等），指定公共路径
  },
  mode: 'development',   // 开发模式
  devServer: {    //
    static: './dist',
    host: 'localhost',   // 指定主机地址，默认是localhost
    port: 8080,    // 指定端口，默认是8080
    hot: true,
    open: true   // 自动打开页面
    // contentBase: '../dist'
  },
  // inline-source-map  让代码显示为我们可以认识的形式， 让代码指向正常的代码行数
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      // file-loader, url-loader用于打包图片、文字、媒体等文件
      {
        test: /\.(png|jpg|gif|ttf|woff)$/,
        use: [
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: 8192,   // 限制文件体积，如果小于限制的大小，则返回base64编码，否则使用file-loder将文件移到输出目录中
              fallback: {
                loader: 'file-loader',    // 将文件进行处理，并将文件移动到输出目录中
                options: {
                  name: '[name].[hash].[ext]'
                }
              }
            }
          }
        ]
      },
      // babel-loader 为了使js代码兼容更多的环境，比如ES6 7 8 转ES5; 而babel/polyfill对新的API进行转换，比如 promise、Generator、Set、Maps、Proxy
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            // @babel/preset-env 一组已经配好的必须的插件
            presets: ['@babel/preset-env']
          }
        },
        exclude: /node_modules/
      },
      // vue-loader 解析.vue文件
      {
        test: /\.vue$/,
        use: ['vue-loader']
      }
    ]
  },
  resolve: {
    alias: {  // 支持为模块路径配置别名
      'vue$': 'vue/dist/vue.runtime.esm.js',
      '@': path.join(__dirname, '../src')
    },
    extensions:['*','.js','.json','.vue']    // 尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/pages/main.html'),    // 模板，使用哪个模板生成
      filename: 'main.html',
      inject: 'body',   // 指定生成script标签的位置
      chunks: ['main']     // 与入口文件对应的模块名
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/base.html'),
      filename: 'base.html',
      chunks: ['base']
    }),
    // new CleanWebpackPlugin({
    //   root: __dirname,
    //   verbose: true,
    //   dry: false,
    //   watch: true,
    //   exclude: []   // 需要忽略的文件
    // }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].css',
    }),

    // new ExtracttextWebpackPlugin('index.scss'),

    new vueLoaderPlugin(),

    new Webpack.HotModuleReplacementPlugin(),     // 用于支持热更新
  ],

  // 优化
  optimization: {
    // minimize: {
    //   // CSS的分割

    // },
    splitChunks: {
      // todo  安装SplitChunksPlugin插件
      chunks: 'all',   // 将公共的代码分割到一个文件   这个时候就是用到  vendor文件了
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modiles[\\/]/,
          name: 'vendor.[contenthash].bundle.js',    // 被打包到这里的文件始终是不变的，所以这个文件名也不变
          chunks: 'all',
        }
      }
    }
  }
};



