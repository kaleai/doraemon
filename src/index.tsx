import React from 'react'
import ReactDOM from 'react-dom'
import { KEY } from './constant'
import 'antd/dist/reset.css'
import './index.css'
import App from './App'

const queries = new URLSearchParams(window.location.search)

const callback = queries.get('callback')
if (callback && callback !== 'undefined') {
  const broadcast = new BroadcastChannel('Doraemon')
  broadcast.postMessage({ category: 'callback', gid: '', queryStr: queries.toString() })
  window.close()
}

// 持久化配置文件
const configUrl = queries.get('config')

if (configUrl && configUrl !== 'undefined') {
  const oldCfgUrl = localStorage.getItem(KEY.GLOBAL_CONFIG)
  if (configUrl !== oldCfgUrl) {
    alert('新配置将会覆盖老的，会触发应用重新初始化，是否确认')
    localStorage.setItem(KEY.GLOBAL_CONFIG, configUrl)
  } else {
    localStorage.setItem(KEY.GLOBAL_CONFIG, configUrl)
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)
