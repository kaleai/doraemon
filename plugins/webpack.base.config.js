const path = require('path')
const webpack = require('webpack')
const pkgInfo = require('./package.json')

/*const libraryName = (pkgInfo.name).replace(/\-(\w)/g, function (all, letter) {
  return letter.toUpperCase()
})*/

module.exports = {
  entry: './src/index.tsx',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'plugin/bundle.js',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    libraryExport: 'default',
    library: '',
    chunkLoadingGlobal: '',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devServer: {
    sockPort: 'location',
    /*headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*"
    }*/
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          }
        ]
      }
    ]
  },
  plugins: [
  ],
  optimization: {},
  externals: {
    /*'react': {
      commonjs: 'react', // CommonJS 模块
      commonjs2: 'react', // CommonJS 模块
      amd: 'react',       // AMD 模块
      root: 'React',     // 全局变量访问
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM',
    },
    'antd': {
      commonjs: 'antd',
      commonjs2: 'antd',
      amd: 'antd',
      root: 'antd',
    },*/
  }
}
