import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import { MicroApp } from 'qiankun/es/interfaces'
import { ConfigProvider, Divider, Layout, Spin, message } from 'antd'
import {
  ActionInfoType,
  ActionHandleResultType,
  IViewElementProps,
  ViewElementInfoType,
  FeedbackInfoType,
} from '../gadget-template/Interface'
import ListView, { ItemType, ListItemDataType } from './component/ListView'
import AppTopBar from './component/AppTopBar'
import SidebarContent from './component/SideBarContent'
import { initGlobalState, MicroAppStateActions } from 'qiankun'
import Settings from './component/SettingsPanel'
import axios from 'axios'
import { IGlobalConfig } from './interface'
import { DEF_CONFIG_URL, KEY } from './constant'
import { addGlobalUncaughtErrorHandler, removeGlobalUncaughtErrorHandler } from 'qiankun'

const md5 = require('js-md5')

const { Header, Sider, Content } = Layout

const App = () => {

  const eventManager: MicroAppStateActions = initGlobalState({})

  const gadgetRef = useRef<MicroApp>()

  const [globalConfig, setGlobalConfig] = useState<IGlobalConfig>()

  const [listData, setListData] = useState<ListItemDataType[]>([])
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)
  const [isShowSettings, setIsShowSettings] = useState<boolean>(false)
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false)

  useEffect(() => {
    const configUrl = localStorage.getItem(KEY.GLOBAL_CONFIG) as string
    axios(configUrl).then(res => {
      if (res.status === 200) {
        window.document.title = res.data.title
        setGlobalConfig(res.data)
      }
    }).catch(err => {
      console.error(err)
      if (window.confirm('配置文件下载异常，是否切换回默认的配置文件')) {
        localStorage.setItem(KEY.GLOBAL_CONFIG, DEF_CONFIG_URL)
        window.location.replace(window.location.origin)
      } else {
        alert(err.toString())
      }
    })

    const errHandler = (args: any) => {
      console.error(args)
    }
    addGlobalUncaughtErrorHandler(errHandler)

    return () => {
      removeGlobalUncaughtErrorHandler(errHandler)
      gadgetRef.current?.unmount()
    }
  }, [])

  const addViewToList = (data: ActionHandleResultType) => {
    const viewPropsList: IViewElementProps[] = []
    const eleInfoList = data.viewElementInfos
    const sessionId = md5(data.sessionUUId)

    eleInfoList.forEach((itemInfo: ViewElementInfoType, index) => {
      const viewType = itemInfo.viewType.startsWith('SYS') ? itemInfo.viewType as ItemType : ItemType.GADGET
      const containerId = sessionId + '_' + index

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
      listData.push({ id: sessionId + '_feedback', type: ItemType.FEEDBACK, data: { sessionUUId: data.sessionUUId } })
    }

    // add suggest
    if (data.suggestActions) {
      listData.push({ id: sessionId + '_suggestion', type: ItemType.SUGGESTION, data: { suggestActions: data.suggestActions } })
    }

    // add divider
    listData.push({ id: sessionId + '_divider', type: ItemType.DIVIDER, data: {} })

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
                }, 300)
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
              globalConfig={globalConfig}
              setGlobalLoading={loading => setIsGlobalLoading(loading)}
              isCollapsed={isCollapsed}
              onClickCollapse={() => setIsCollapsed(!isCollapsed)}
              onReceiveActionHandleResult={data => {
                console.log('receive action', data)
                addViewToList(data)
              }}
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
                      message.success('感谢您的反馈，我会继续努力 💪🏻')

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
