import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { MicroApp } from 'qiankun/es/interfaces'
import { ConfigProvider, Divider, FloatButton, Layout } from 'antd'
import { ConversationDataType, IViewElementProps, ViewElementInfoType } from '../../gadgets/template/Interface'
import ListView, { ItemType, ListItemDataType } from './component/ListView'
import AppTopBar from './component/AppTopBar'
import SidebarContent from './component/SideContent'
import { v4 as uuid } from 'uuid'
import { initGlobalState, MicroAppStateActions } from 'qiankun'

const { Header, Sider, Content } = Layout

const App = () => {

  const stateManager: MicroAppStateActions = initGlobalState({})

  const gadgetRef = useRef<MicroApp>()

  const [listData, setListData] = useState<ListItemDataType[]>([])
  const [collapsed, setCollapsed] = useState<boolean>(false)


  useEffect(() => {
    return () => {
      gadgetRef.current?.unmount()
    }
  }, [])

  const addViewToList = (data: ConversationDataType) => {
    const viewPropsList: IViewElementProps[] = []

    data.viewElementInfos.forEach((itemInfo: ViewElementInfoType) => {
      const containerId = 'CID:' + uuid()

      listData.push({
        id: containerId,
        type: ItemType.GADGET,
      })

      viewPropsList.push({
        containerId,
        isReadonly: false,
        ...itemInfo,
      })
    })

    const newList = listData

    newList.push({ id: uuid(), type: ItemType.FEEDBACK, conversationId: data.conversationId })

    if (data.suggestActions) {
      newList.push({ id: uuid(), type: ItemType.SUGGESTION, suggestActions: data.suggestActions })
    }

    newList.push({ id: uuid(), type: ItemType.DIVIDER })

    setListData([...newList])

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
              onReceiveConversationData={data => addViewToList(data)}
            />

            <Divider style={{ margin: 0 }} />

            <Content style={{ padding: 12 }}>
              <ListView
                dataSource={listData}
                onClickSuggestAction={(params) => {
                  stateManager.setGlobalState({
                    type: 'ACTION',
                    params
                  })
                }}
                onReceiveFeedback={(like, conversationId) => {
                  stateManager.setGlobalState({
                    type: 'FEEDBACK',
                    params:{
                      like,
                      conversationId
                    }
                  })
                }}
              />
              <FloatButton.BackTop />
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </div>
  )
}

export default App
