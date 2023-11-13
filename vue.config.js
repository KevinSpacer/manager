const path = require('path')

// node版本不满足条件
// const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

const { VueLoaderPlugin } = require('vue-loader')

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  configureWebpack: {
    module: {
      rules: [{
        test: /\.mhs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      }, {
        test: /\.sass$/,
        loaders: ['style', 'css', 'sass']
      }]
    },
    plugins: [
      // node版本不满足条件
      // 插件
      // require('unplugin-auto-import/webpack')(ElementPlusResolver()),
      // require('unplugin-vue-components/webpack')(ElementPlusResolver()),
    ],
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            warnings: false,
            compress: {
              drop_console: true,//console
              drop_debugger: false,
              pure_funcs: ['console.log'] // 移除console
            }
          },
          sourceMap: false,
          parallel: true
        })
      ]
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', path.resolve(__dirname, './src'))
      .set('@Views', path.resolve(__dirname, './src/views'))
      .set('@Assets', path.resolve(__dirname, './src/assets'))
      .set('@/images', path.resolve(__dirname, './src/assets/images'))
      .set('@Components', path.resolve(__dirname, './src/components'))
      .set('@Utils', path.resolve(__dirname, './src/utils'))
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
      ]
    }
  },
  parallel: false,
  lintOnSave: true,
  productionSourceMap: true, //不生成map
  runtimeCompiler: true, // 包含运行时编译器的 Vue 构建版本
  publicPath: './',
  // outputDir: '../tt/www/', // 输出的dist文件夹路径
  assetsDir: './',
  filenameHashing: true,
  devServer: {
    port: 8085,
    open: false,
    hot: true,
    https: false,
    disableHostCheck: true
    // contentBase: path.resolve(__dirname, '../..', 'www'),
    // proxy: {
    //   //匹配规则
    //   '/dseWeb': {
    //     //要访问的跨域的域名 https://pxxt.shopismini.com:8090/fire-hydrant/manage-api/doc.html#/home
    //     target: 'https://pxxt.shopismini.com:8090',
    //     ws: true,
    //     secure: false, // 使用的是http协议则设置为false，https协议则设置为true
    //     changOrigin: true, //开启代理
    //     pathRewrite: {
    //       '^/dseWeb': ''
    //     }
    //   }
    // }
  }
}
