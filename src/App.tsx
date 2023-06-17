import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { MicroApp } from 'qiankun/es/interfaces'
import { ConfigProvider, Divider, Layout, Spin } from 'antd'
import {
  ActionInfoType,
  ActionHandleResultType,
  IViewElementProps,
  ViewElementInfoType, FeedbackInfoType,
} from '../gadget-template/Interface'
import ListView, { ItemType, ListItemDataType } from './component/ListView'
import AppTopBar from './component/AppTopBar'
import SidebarContent from './component/SideBarContent'
import { v4 as uuid } from 'uuid'
import { initGlobalState, MicroAppStateActions } from 'qiankun'
import Settings from './pages/Settings'
import axios from 'axios'
import { IGlobalConfig } from './interface'

const { Header, Sider, Content } = Layout

const App = () => {

  const eventManager: MicroAppStateActions = initGlobalState({})

  const gadgetRef = useRef<MicroApp>()

  const [globalConfig, setGlobalConfig] = useState<IGlobalConfig>()

  const [listData, setListData] = useState<ListItemDataType[]>([])
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [isShowSettings, setIsShowSettings] = useState<boolean>(true)
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false)


  useEffect(() => {
    axios('https://raw.githubusercontent.com/doraemon-ai/4th-dimensional-pocket/main/config.json').then(res => {
      if (res.status === 200) {
        setGlobalConfig(res.data)
      }
    })

    return () => {
      gadgetRef.current?.unmount()
    }
  }, [])

  const addViewToList = (data: ActionHandleResultType) => {
    const viewPropsList: IViewElementProps[] = []
    const eleInfoList = data.viewElementInfos

    eleInfoList.forEach((itemInfo: ViewElementInfoType, index) => {
      const viewType = itemInfo.viewType.startsWith('SYS') ? itemInfo.viewType as ItemType : ItemType.GADGET
      const containerId = 'CID:' + uuid()

      listData.push({
        id: containerId,
        type: viewType,
        data: itemInfo.data,
      })

      if (viewType === ItemType.GADGET) {
        viewPropsList.push({
          containerId,
          isReadonly: index < eleInfoList.length - 1,
          ...itemInfo,
        })
      }
    })

    // add feedback
    if (data.canFeedback !== false) {
      listData.push({ id: uuid(), type: ItemType.FEEDBACK, data: { sessionUUId: data.sessionUUId } })
    }

    // add suggest
    if (data.suggestActions) {
      listData.push({ id: uuid(), type: ItemType.SUGGESTION, data: { suggestActions: data.suggestActions } })
    }

    // add divider
    listData.push({ id: uuid(), type: ItemType.DIVIDER, data: {} })

    setListData([...listData])

    // bind view to list item
    viewPropsList.forEach(props => setTimeout(() => gadgetRef.current?.update?.(props), 50))
  }

  if (!globalConfig) {
    return <Spin spinning />
  }

  return (
    <div className="App">
      <ConfigProvider prefixCls={'doraemon'}>
        <Layout prefix={'App'}>
          <Sider
            width={230}
            breakpoint="lg"
            collapsedWidth="0"
            trigger={null}
            collapsible
            collapsed={isCollapsed}
          >
            <SidebarContent
              globalConfig={globalConfig}
              onClickSettings={() => {
                setIsShowSettings(true)

                setTimeout(() => {
                  setIsCollapsed(true)
                }, 450)
              }}
            />
          </Sider>

          <Settings
            globalConfig={globalConfig}
            isHide={!isShowSettings}
            onClickClose={() => {
              setIsCollapsed(false)
              setIsShowSettings(false)
            }}
          />

          <Layout className={'layout'} style={{ display: isShowSettings ? 'none' : undefined }}>
            <AppTopBar
              setGlobalLoading={loading => setIsGlobalLoading(loading)}
              isCollapsed={isCollapsed}
              onClickCollapse={() => setIsCollapsed(!isCollapsed)}
              onReceiveActionHandleResult={data => addViewToList(data)}
              onGadgetChanged={gadget => {
                gadgetRef.current = gadget

                setTimeout(() => {
                  eventManager.setGlobalState({
                    category: 'ACTION',
                    params: {
                      action: 'SYS_INITIALIZATION',
                      expectation: 'init gadget',
                    } as ActionInfoType,
                  })
                }, 200)
              }}
            />

            <Divider style={{ margin: 0 }} />

            <Content>
              <Spin spinning={isGlobalLoading}>
                <div
                  style={{
                    height: window.innerHeight - 60,
                    overflow: 'auto',
                    padding: 12,
                  }}
                >
                  <ListView
                    dataSource={listData}
                    onClickSuggestAction={(params) => {
                      eventManager.setGlobalState({
                        category: 'ACTION',
                        params,
                      })
                    }}
                    onReceiveFeedback={(like, sessionUUId) => {
                      eventManager.setGlobalState({
                        category: 'FEEDBACK',
                        params: {
                          like,
                          sessionUUId,
                        } as FeedbackInfoType,
                      })
                    }}
                  />
                </div>
              </Spin>
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </div>
  )
}

export default App
