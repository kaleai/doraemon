import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { Avatar, Card, List } from 'antd'
import { loadMicroApp } from 'qiankun'
import { MicroApp } from 'qiankun/es/interfaces'
import { Layout, Menu, Button, theme } from 'antd'
import { ListItemInfo, IViewProps } from '../../plugins/template/Interface'
import { HandleResultDataType } from '../../plugins/template/Interface'
import ListView from './component/ListView'
import AppBar from './component/AppBar'
import SiderContent from './component/SiderContent'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'

const { Header, Footer, Sider, Content } = Layout

const App = () => {

  const pluginRef = useRef<MicroApp>()

  const [listData, setListData] = useState<any[]>([])
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    return () => {
      pluginRef.current?.unmount()
    }
  }, [])

  const addViewToList = (data: HandleResultDataType) => {
    const viewPropsList: IViewProps[] = []

    data.listItemInfos.forEach((itemInfo: ListItemInfo) => {
      const containerId = 'CID_' + Math.random()

      listData.push({
        id: containerId,
      })

      viewPropsList.push({
        containerId,
        readonly: false,
        ...itemInfo,
      })
    })

    // update list data
    setListData([...listData])

    // bind view to list
    if (pluginRef.current) {
      viewPropsList.forEach(props => {
        setTimeout(() => pluginRef.current?.update?.(props).then(), 100)
      })
    }
  }

  return (
    <div className="App">
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <SiderContent />
        </Sider>

        <Layout>
          <Header style={{ padding: 0 }}>
            <AppBar
              onPluginChanged={plugin => pluginRef.current = plugin}
              onReceiveViewData={data => {
                addViewToList(data)
              }}
            />
          </Header>
          <Content
          >
            <ListView dataSource={listData} />
          </Content>
        </Layout>
      </Layout>

    </div>
  )
}

export default App
