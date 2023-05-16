import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { MicroApp } from 'qiankun/es/interfaces'
import { Layout } from 'antd'
import { ListItemInfo, IViewProps } from '../../gadgets/template/Interface'
import { HandleResultDataType } from '../../gadgets/template/Interface'
import ListView from './component/ListView'
import AppTopBar from './component/AppTopBar'
import SidebarContent from './component/SidebarContent'

const { Header, Sider, Content } = Layout

const App = () => {

  const gadgetRef = useRef<MicroApp>()

  const [listData, setListData] = useState<any[]>([])
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    return () => {
      gadgetRef.current?.unmount()
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
    if (gadgetRef.current) {
      viewPropsList.forEach(props => {
        setTimeout(() => gadgetRef.current?.update?.(props).then(), 100)
      })
    }
  }

  return (
    <div className="App">
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <SidebarContent />
        </Sider>

        <Layout>
          <Header style={{ padding: 0 }}>
            <AppTopBar
              onGadgetChanged={plugin => gadgetRef.current = plugin}
              onReceiveViewData={data => addViewToList(data)}
            />
          </Header>
          <Content>
            <ListView dataSource={listData} />
          </Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default App
