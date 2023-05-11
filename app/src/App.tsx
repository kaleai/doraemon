import React, { useEffect, useRef, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { loadMicroApp } from 'qiankun'
import { MicroApp } from 'qiankun/es/interfaces'
import { initGlobalState, MicroAppStateActions } from 'qiankun'
import { Button} from 'antd'


const App = () => {

  const [curPlugin, setCurPlugin] = useState<MicroApp>()

  const [actions, setActions] = useState<MicroAppStateActions>()

  const [viewList, setViewList] = useState<any[]>([])

  useEffect(() => {
    const actionList: MicroAppStateActions = initGlobalState({ name: 'kale' })
    actionList.onGlobalStateChange((state, prev) => {
      // state: 变更后的状态; prev 变更前的状态
      console.log('主应用监听', state)
    })
    setActions(actionList)

    return () => {
      curPlugin?.unmount()
    }
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <Button onClick={() => {
          const microApp = loadMicroApp({
            name: 'DebugPlugin',
            entry: '//localhost:3000/plugin',
            container: '#pluginContainer',
            props: { brand: 'qiankun' },
          })
          setCurPlugin(microApp)
        }}>add plugin
        </Button>

        <br />

        <Button onClick={async () => {
          const CID = 'Container' + Math.random()
          viewList.push({
            id: CID,
          })
          setViewList([...viewList])

          if (curPlugin) {
            setTimeout(() => {
              curPlugin.update?.(
                {
                  type: 'button',
                  data: { text: 'text 按钮' + Math.random(), expectation: '' },
                  containerId: CID,
                  onReceiveAction: (action: any, exp: any, values: any) => {

                    actions?.setGlobalState({ category: 'ACTION', action, expectation: exp, values })
                  },
                },
              ).then()
            }, 100)
          }
        }}>update
        </Button>
        <br />

        <Button type={'primary'} onClick={() => {
          actions?.setGlobalState({ category: 'ACTION', action: '发送事件', expectation: 'expectation', values: {} })
        }}>
          发送事件
        </Button>

        {viewList.map(item => {
          return <div key={item.id} id={item.id} />
        })}

      </header>
    </div>
  )
}

export default App
