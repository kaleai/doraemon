import React from 'react'
import ReactDOM from 'react-dom'
import { KEY } from './constant'
import 'antd/dist/reset.css'
import './index.css'
import App from './App'
import { Analytics } from '@vercel/analytics/react';

const queries = new URLSearchParams(window.location.search)

// 处理回调并发送信息给接收方
const callback = queries.get('callback')
if (callback && callback !== 'undefined') {
  const broadcast = new BroadcastChannel('Doraemon')
  broadcast.postMessage({ category: 'callback', queriesString: queries.toString() })
  window.close()
}

// 持久化配置文件
// @ts-ignore
const defGlobalCfgUrl: string = document.getElementsByTagName('meta')['global-config'].content
localStorage.setItem(KEY.DEF_GLOBAL_CONFIG, defGlobalCfgUrl)

const newCfgUrl = queries.get('config')
const oldCfgUrl = localStorage.getItem(KEY.GLOBAL_CONFIG)

if (newCfgUrl && newCfgUrl !== 'undefined') {
  if (newCfgUrl !== oldCfgUrl) {
    if (window.confirm('新配置将会覆盖老的，会触发应用重新初始化，是否确认')) {
      localStorage.setItem(KEY.GLOBAL_CONFIG, newCfgUrl)
    }
  } else {
    localStorage.setItem(KEY.GLOBAL_CONFIG, newCfgUrl)
  }
} else {
  if (!oldCfgUrl) {
    // 如果之前没有配置文件，则设置默认的配置文件
    localStorage.setItem(KEY.GLOBAL_CONFIG, defGlobalCfgUrl)
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Analytics/>
  </React.StrictMode>,
  document.getElementById('root'),
)
