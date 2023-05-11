const webpack = require('webpack')
const config = require('./webpack.base.config')
const pkgInfo = require('./package.json')

config.mode = 'development'
config.output.library = 'DebugPlugin'
config.output.chunkLoadingGlobal = `webpackJsonp_${pkgInfo.name}`

config.devServer = {
  port: 7031,
  static: './dist',
}

module.exports = config
