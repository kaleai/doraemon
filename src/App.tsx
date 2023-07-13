import React, { useState } from 'react'
import { MicroApp } from 'qiankun/es/interfaces'
import { Button, ConfigProvider, Divider, Layout } from 'antd'
import AppTopBar from './component/AppTopBar'
import SidebarPanel from './component/SideBarPanel'
import Settings from './component/SettingsOverlay'
import { IGlobalConfig } from './interface'
import { initGlobalState, MicroAppStateActions } from 'qiankun'
import { ConversationDBHelper, dom2json, json2dom } from './utils'
import MainContent from './component/MainContent'
import { IGadgetInfo } from './component/GadgetDetail'
import useListData from './hooks/useListData'
import { ID } from './constant'

import './App.css'

const SideBarWidth = 230

const { Header, Sider, Content } = Layout

const App = ({ globalConfig }: { globalConfig: IGlobalConfig }) => {

  const eventManager: MicroAppStateActions = initGlobalState({})

  const [collapsed, setCollapsed] = useState<boolean>(false)

  // 是否展示设置页面
  const [showSettings, setShowSettings] = useState<boolean>(false)

  const [microApp, setMicroApp] = useState<MicroApp | undefined>()

  // 当前的gadget信息
  const [gadgetInfo, setGadgetInfo] = useState<IGadgetInfo | undefined>()

  const [conversationId, setConversationId] = useState<string | undefined>()

  const { loading, listData, sendActionToGadget, onReceiveHandleResult } = useListData(eventManager, microApp, conversationId)

  /**
   * 保存历史记录
   */
  const saveHistoryRecords = (id: string) => {
    const historyEle = document.getElementById(ID.HISTORY_RECORD)
    if (historyEle) {
      historyEle.style.opacity = '1'
      historyEle.lastChild?.remove()
    }

    const historyRecords = dom2json(ID.GADGET_CONTENT) // 保存之前的记录
    ConversationDBHelper.updateHistory(id, historyRecords)
  }

  /**
   * 恢复历史记录
   * @param record
   */
  const recoverHistoryRecords = (record: object | null | undefined) => {
    const element = document.getElementById(ID.HISTORY_RECORD)
    if (element) {
      element.innerHTML = ''
    }

    if (record && element) {
      element.style.opacity = '0.6'
      element.appendChild(json2dom(record))

      const divider = document.createElement('span')
      divider.innerText = '------------- 以上为历史消息 ----------------'
      divider.style.color = 'gray'
      element.append(divider)

    }
  }

  const changeConversation = (curId: string | undefined, prevId: string | undefined) => {
    prevId && saveHistoryRecords(prevId)

    setConversationId(curId)
    ConversationDBHelper.find(curId ?? '').then(res => {
      setGadgetInfo(res?.gadget)
      recoverHistoryRecords(res?.record)
    })
  }

  return (
    <div className="app">
      <ConfigProvider prefixCls={'doraemon'}>
        <Layout>
          <Sider
            width={SideBarWidth} breakpoint="lg" collapsedWidth="0"
            collapsible collapsed={collapsed} trigger={null}
          >
            <SidebarPanel
              globalConfig={globalConfig}
              selectMenuId={conversationId}
              onMenuClick={changeConversation}
              onClickSettings={() => {
                setShowSettings(true)
                changeConversation(undefined, conversationId)
                setTimeout(() => setCollapsed(true), 300)
              }}
            />
          </Sider>

          <Settings
            globalConfig={globalConfig}
            isHide={!showSettings}
            onClickClose={() => {
              setCollapsed(false)
              setShowSettings(false)
            }}
          />

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
            </Header>

            <Content style={{ overflow: 'initial', padding: 12 }}>
              <MainContent
                eventManager={eventManager}
                loading={loading}
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
