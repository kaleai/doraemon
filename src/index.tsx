import React from 'react'
import ReactDOM from 'react-dom'
import { KEY } from './constant'
import 'antd/dist/reset.css'
import './index.css'
import App from './App'

const queries = new URLSearchParams(window.location.search)

// 持久化access_token
const accessToken = queries.get('access_token')
if (accessToken && accessToken !== 'undefined') {
  localStorage.setItem(KEY.ACCESS_TOKEN, accessToken)
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
)
