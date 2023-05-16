const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const pkgInfo = require('./package.json')

const gadgetName = (pkgInfo.name).replace(/\-(\w)/g, (all, letter) => letter.toUpperCase())

module.exports = {
  entry: './src/index.tsx',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'gadget.js',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    libraryExport: 'default',
    library: gadgetName,
    chunkLoadingGlobal: '',
  },
  devServer: {},
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
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
    new HtmlWebpackPlugin({
      title: pkgInfo.name,
      filename:'index.html',
      template: 'index.html',
    })
  ]
}
