import React, { useEffect, useRef, useState } from 'react'
import { MicroApp } from 'qiankun/es/interfaces'
import { ConfigProvider, Divider, Layout } from 'antd'
import AppTopBar from './component/AppTopBar'
import SidebarContent from './component/SideBarArea'
import { initGlobalState, MicroAppStateActions } from 'qiankun'
import Settings from './component/SettingsOverlay'
import { IGlobalConfig } from './interface'
import { addGlobalUncaughtErrorHandler, removeGlobalUncaughtErrorHandler } from 'qiankun'
import { ConversationDBHelper } from './utils'
import MainContent from './component/MainContent'
import { IGadgetInfo } from './component/GadgetDetail'
import './App.css'
import useListData from './hooks/useListData'

const { Header, Sider, Content } = Layout

const App = ({ globalConfig }: { globalConfig: IGlobalConfig }) => {

  const gadgetRef = useRef<MicroApp>()

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false)

  const [isShowSettings, setIsShowSettings] = useState<boolean>(false)

  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false)

  const [curGadgetInfo, setCurGadgetInfo] = useState<IGadgetInfo | undefined>()

  const [domJson, setDomJson] = useState<Record<string, string> | undefined>()

  const eventManager: MicroAppStateActions = initGlobalState({})

  const { sendActionToGadget, onReceiveHandleResult } = useListData(eventManager, gadgetRef?.current)

  useEffect(() => {
    const errHandler = (args: any) => console.error(args)
    addGlobalUncaughtErrorHandler(errHandler)

    return () => {
      removeGlobalUncaughtErrorHandler(errHandler)
      gadgetRef.current?.unmount()
    }
  }, [])

  return (
    <div className="App">
      <ConfigProvider prefixCls={'doraemon'}>
        <Layout prefix={'App'}>
          <Settings
            globalConfig={globalConfig}
            isHide={!isShowSettings}
            onClickClose={() => {
              setIsCollapsed(false)
              setIsShowSettings(false)
            }}
          />

          <Sider width={230} breakpoint="lg" collapsedWidth="0" trigger={null} collapsible collapsed={isCollapsed}>
            <SidebarContent
              globalConfig={globalConfig}
              onMenuClick={(id) => {

                ConversationDBHelper.find(id).then(res => {
                  console.log('res', res)

                  setCurGadgetInfo(undefined)
                })
              }}
              onClickSettings={() => {
                setIsShowSettings(true)

                setTimeout(() => {
                  setIsCollapsed(true)
                }, 300)
              }}
            />
          </Sider>

          <Layout className={'layout'} style={{ display: isShowSettings ? 'none' : undefined }}>
            <AppTopBar
              gadgetInfo={curGadgetInfo}
              globalConfig={globalConfig}
              setGlobalLoading={loading => setIsGlobalLoading(loading)}
              isCollapsed={isCollapsed}
              onClickCollapse={() => setIsCollapsed(!isCollapsed)}
              onReceiveActionHandleResult={res => onReceiveHandleResult(res)}
              onGadgetChanged={gadget => {
                gadgetRef.current = gadget

                setTimeout(() => {
                  sendActionToGadget({
                    action: 'SYS_INITIALIZATION',
                    expectation: 'init gadget',
                  })
                }, 200)
              }}
            />

            <Divider style={{ margin: 0 }} />

            <Content>
              <MainContent
                domJson={domJson}
                curGadgetRef={gadgetRef?.current}
                isGlobalLoading={isGlobalLoading}
              />
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </div>
  )
}

export default App
