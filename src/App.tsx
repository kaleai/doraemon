import React, { useEffect, useState } from 'react'
import { MicroApp } from 'qiankun/es/interfaces'
import { Button, ConfigProvider, Divider, Layout } from 'antd'
import AppTopBar from './component/AppTopBar'
import SidebarContent from './component/SideBarArea'
import Settings from './component/SettingsOverlay'
import { IGlobalConfig } from './interface'
import { initGlobalState, MicroAppStateActions } from 'qiankun'
import { ConversationDBHelper, dom2json } from './utils'
import MainContent from './component/MainContent'
import { IGadgetInfo } from './component/GadgetDetail'
import useListData from './hooks/useListData'
import { ID } from './constant'

import './App.css'
import { Buffer } from 'buffer'

const SideBarWidth = 230

const { Header, Sider, Content } = Layout

const App = ({ globalConfig }: { globalConfig: IGlobalConfig }) => {

  /**
   * qiankun微应用的事件发送器
   */
  const eventManager: MicroAppStateActions = initGlobalState({})

  /**
   * 侧边栏是否收起
   */
  const [collapsed, setCollapsed] = useState<boolean>(false)

  /**
   * 是否展示设置页面
   */
  const [showSettings, setShowSettings] = useState<boolean>(false)

  /**
   * 当前的微应用
   */
  const [microApp, setMicroApp] = useState<MicroApp | undefined>()

  /**
   * 当前的gadget信息
   */
  const [gadgetInfo, setGadgetInfo] = useState<IGadgetInfo | undefined>()

  /**
   * 历史记录
   */
  const [historyRecord, setHistoryRecord] = useState<Record<string, string> | undefined>()

  /**
   * 会话ID
   */
  const [conversationId, setConversationId] = useState<string | undefined>()

  /**
   * 主内容区域的信息
   */
  const { loading, listData, sendActionToGadget, onReceiveHandleResult } = useListData(eventManager, microApp, conversationId)

  useEffect(() => {
    const onAppWillBeExit = (event: any) => {
      event.preventDefault() // 阻止默认事件

      // 将当前的会话置空
      changeConversation(undefined, conversationId)

      return (event.returnValue = 'Are you sure you want to exit?')
    }
    // window.addEventListener('beforeunload', onAppWillBeExit)

    return () => {
      window.removeEventListener('beforeunload', onAppWillBeExit)
    }
  }, [])

  const changeConversation = (curId: string | undefined, prevId: string | undefined) => {
    if (prevId) {
      // 保存之前的记录
      const historyRecords = dom2json(ID.GADGET_CONTENT)
      ConversationDBHelper.updateHistory(prevId, historyRecords)
    }

    /*if (microApp) {
      microApp.unmount().then(() => {
        setConversationId(curId)
        ConversationDBHelper.find(curId ?? '').then(res => {
          // setGadgetInfo(res?.gadget)
          setHistoryRecord(res?.record)
        })
      })
    } else {*/
      setConversationId(curId)
      ConversationDBHelper.find(curId ?? '').then(res => {
        setGadgetInfo(res?.gadget)
        setHistoryRecord(res?.record)
      })
    // }
  }

  return (
    <div className="App">
      <ConfigProvider prefixCls={'doraemon'}>
        <Settings
          globalConfig={globalConfig}
          isHide={!showSettings}
          onClickClose={() => {
            setCollapsed(false)
            setShowSettings(false)
          }}
        />

        <Layout>
          <Sider
            width={SideBarWidth} breakpoint="lg" collapsedWidth="0"
            collapsible collapsed={collapsed} trigger={null}
          >
            <SidebarContent
              globalConfig={globalConfig}
              onMenuClick={changeConversation}
              onClickSettings={() => {
                setShowSettings(true)
                setTimeout(() => setCollapsed(true), 300)
              }}
            />
          </Sider>

          <Layout className={'layout'} style={{ display: showSettings ? 'none' : undefined }}>
            <Header className={'header'}>
              <AppTopBar
                globalConfig={globalConfig}
                onReceiveActionHandleResult={onReceiveHandleResult}

                isCollapsed={collapsed}
                onClickCollapse={() => setCollapsed(!collapsed)}

                gadgetInfo={gadgetInfo}
                onGadgetChange={(info, microApp) => {
                  ConversationDBHelper.updateGadget(conversationId as string, info)
                  setGadgetInfo(info)
                  setMicroApp(microApp)
                }}
              />
              <Divider style={{ margin: 0 }} />
            </Header>

            <Content style={{ overflow: 'initial', padding: 12 }}>
              <Button onClick={() => {
                // 将当前的会话置空
                changeConversation(undefined, conversationId)
              }}>
                save
              </Button>
              <MainContent
                eventManager={eventManager}
                loading={loading}
                history={historyRecord}
                listData={listData}
                onClickSuggest={sendActionToGadget}
              />
            </Content>

          </Layout>
        </Layout>
      </ConfigProvider>
    </div>
  )
}

export default App
