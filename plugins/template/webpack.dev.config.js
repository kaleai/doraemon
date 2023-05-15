const webpack = require('webpack')
const config = require('./webpack.config')
const pkgInfo = require('../package.json')

config.mode = 'development'
config.output.library = 'DebugPlugin'
config.output.chunkLoadingGlobal = `webpackJsonp_${pkgInfo.name}`

config.devServer = {
  sockPort: 'location',
  /*headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*"
  }*/
  port: 7031,
  static: './dist',
}

module.exports = config
