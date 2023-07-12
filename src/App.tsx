import React, { useEffect, useState } from 'react'
import { MicroApp } from 'qiankun/es/interfaces'
import { ConfigProvider, Divider, Layout } from 'antd'
import AppTopBar from './component/AppTopBar'
import SidebarContent from './component/SideBarArea'
import Settings from './component/SettingsOverlay'
import { IGlobalConfig } from './interface'
import { initGlobalState, MicroAppStateActions } from 'qiankun'
import { ConversationDBHelper, dom2json } from './utils'
import MainContent from './component/MainContent'
import { IGadgetInfo } from './component/GadgetDetail'
import './App.css'
import useListData from './hooks/useListData'

const { Header, Sider, Content } = Layout

const App = ({ globalConfig }: { globalConfig: IGlobalConfig }) => {

  const eventManager: MicroAppStateActions = initGlobalState({})

  const [curMicroApp, setCurMicroApp] = useState<MicroApp>()

  const { loading, listData, sendActionToGadget, onReceiveHandleResult } = useListData(eventManager, curMicroApp)

  const [collapsed, setCollapsed] = useState<boolean>(false)

  const [showSettings, setShowSettings] = useState<boolean>(false)

  const [curGadgetInfo, setCurGadgetInfo] = useState<IGadgetInfo | undefined>()

  const [historyRecord, setHistoryRecord] = useState<Record<string, string> | undefined>()

  useEffect(() => {
    const onPageWillBeClosed = (event: any) => {
      event.preventDefault()
      // TODO by kale: 2023/6/29 设置map前卸载当前gadget

      const historyRecords = dom2json('gadget-content')
      localStorage.setItem('haha', JSON.stringify(historyRecords))

      // gadget?.unmount()

      return (event.returnValue = 'Are you sure you want to exit?')
    }
    // window.addEventListener('beforeunload', onPageWillBeClosed)

    return () => {
      window.removeEventListener('beforeunload', onPageWillBeClosed)
    }
  }, [])

  return (
    <div className="App">
      <ConfigProvider prefixCls={'doraemon'}>
        <Layout prefix={'App'}>
          <Settings
            globalConfig={globalConfig}
            isHide={!showSettings}
            onClickClose={() => {
              setCollapsed(false)
              setShowSettings(false)
            }}
          />

          <Sider
            width={230} breakpoint="lg" collapsedWidth="0"
            trigger={null} collapsible collapsed={collapsed}
          >
            <SidebarContent
              globalConfig={globalConfig}
              onMenuClick={async (curId, prevId) => {
                if (prevId) {
                  const jsonObj = dom2json('gadget-content')
                  await ConversationDBHelper.update(prevId, jsonObj, curGadgetInfo)
                }

                ConversationDBHelper.find(curId).then(res => {
                  console.log('res', res)

                  setCurGadgetInfo(undefined)
                  setHistoryRecord(undefined)
                })
              }}
              onClickSettings={() => {
                setShowSettings(true)

                setTimeout(() => {
                  setCollapsed(true)
                }, 300)
              }}
            />
          </Sider>

          <Layout className={'layout'} style={{ display: showSettings ? 'none' : undefined }}>
            <AppTopBar
              globalConfig={globalConfig}
              onReceiveActionHandleResult={onReceiveHandleResult}

              isCollapsed={collapsed}
              onClickCollapse={() => setCollapsed(!collapsed)}

              gadgetInfo={curGadgetInfo}
              onGadgetChanged={(info, microApp) => {
                setCurGadgetInfo(info)
                setCurMicroApp(microApp)
              }}
            />

            <Divider style={{ margin: 0 }} />

            <Content>
              <MainContent
                loading={loading}
                historyRecord={historyRecord}
                listData={listData}
                onClickSuggestAction={actInfo => sendActionToGadget(actInfo)}
              />
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </div>
  )
}

export default App
