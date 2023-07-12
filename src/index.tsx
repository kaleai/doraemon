import React from 'react'
import ReactDOM from 'react-dom'
import { KEY } from './constant'
import 'antd/dist/reset.css'
import './index.css'
import App from './App'
import { Analytics } from '@vercel/analytics/react'
import axios from 'axios'
import { ConversationDBHelper, LocalHelper } from './utils'

/**
 * 得到url的query string
 */
const queries = new URLSearchParams(window.location.search)

/*
 * 处理回调并发送信息给接收方
 */
const callback = queries.get('callback')
if (callback && callback !== 'undefined') {
  const broadcast = new BroadcastChannel('Doraemon')
  broadcast.postMessage({ category: 'callback', queriesString: queries.toString() })
  window.close()
}

/**
 * 初始化数据库
 */
ConversationDBHelper.init()

const meta = document.getElementsByTagName('meta')
// @ts-ignore
const defCfgUrl = meta['global-config'].content

/**
 * 得到配置文件
 */
const getConfigUrl = (): string => {
  const newUrl = queries.get('config')
  const oldUrl = LocalHelper.get(KEY.GLOBAL_CONFIG)

  if (newUrl && newUrl !== 'undefined') {
    if (newUrl !== oldUrl && window.confirm('新配置将会覆盖老的，会重新初始化，是否确认用新的配置？')) {
      LocalHelper.set(KEY.GLOBAL_CONFIG, newUrl)
      LocalHelper.delete(KEY.GADGETS_ID_MAP)
    }
  } else if (!oldUrl) { // 如果之前没有配置文件，则设置默认的配置文件
    LocalHelper.set(KEY.GLOBAL_CONFIG, defCfgUrl)
  }

  return LocalHelper.get(KEY.GLOBAL_CONFIG) as string
}

/**
 * 下载配置文件，json形式
 */
axios(getConfigUrl()).then(({ status, data: cfg }) => {
  if (status === 200) {
    window.document.title = cfg.title

    ReactDOM.render(
      <React.StrictMode>
        <App globalConfig={cfg} />
        <Analytics />
      </React.StrictMode>,
      document.getElementById('root'),
    )
  }
}).catch(err => {
  console.error(err)

  if (window.confirm('远端配置下载异常，是否切换到默认配置？')) {
    LocalHelper.set(KEY.GLOBAL_CONFIG, defCfgUrl)
    window.location.replace(window.location.origin)
  } else {
    alert(err.toString())
  }
})
