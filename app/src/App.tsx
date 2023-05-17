import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { MicroApp } from 'qiankun/es/interfaces'
import { ConfigProvider, Divider, Layout } from 'antd'
import { ListItemInfo, IViewProps } from '../../gadgets/template/Interface'
import { HandleResultDataType } from '../../gadgets/template/Interface'
import ListView from './component/ListView'
import AppTopBar from './component/AppTopBar'
import SidebarContent from './component/SidebarContent'

const { Header, Sider, Content } = Layout

const App = () => {

  const gadgetRef = useRef<MicroApp>()

  const [listData, setListData] = useState<{ id: string, type?: string }[]>([])
  const [collapsed, setCollapsed] = useState<boolean>(false)

  useEffect(() => {
    return () => {
      gadgetRef.current?.unmount()
    }
  }, [])

  const addViewToList = (data: HandleResultDataType) => {
    const viewPropsList: IViewProps[] = []

    data.listItemInfos.forEach((itemInfo: ListItemInfo) => {
      const containerId = 'CID:' + Math.random()

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
    listData.push({ id: 'DIVIDER:' + Math.random(), type: 'DIVIDER' })
    setListData([...listData])

    // bind view to list
    if (gadgetRef.current) {
      viewPropsList.forEach(props => {
        setTimeout(() => gadgetRef.current?.update?.(props).then(), 50)
      })
    }
  }

  return (
    <div className="App">
      <ConfigProvider prefixCls={'doreamon'}>
      <Layout prefix={'App'}>
        <Sider
          width={230}
          breakpoint="lg"
          collapsedWidth="0"
          trigger={null} collapsible collapsed={collapsed}>
          <SidebarContent />
        </Sider>

        <Layout className={'layout'}>
          <AppTopBar
            isCollapsed={collapsed}
            onClickCollapse={() => setCollapsed(!collapsed)}
            onGadgetChanged={plugin => gadgetRef.current = plugin}
            onReceiveViewData={data => addViewToList(data)}
          />

          <Divider style={{ margin: 0 }} />

          <Content style={{ padding: 12 }}>
            <ListView dataSource={listData} />
          </Content>
        </Layout>
      </Layout>
      </ConfigProvider>
    </div>
  )
}

export default App
