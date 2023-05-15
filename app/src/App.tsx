import React, { useEffect, useRef, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { loadMicroApp } from 'qiankun'
import { MicroApp } from 'qiankun/es/interfaces'
import { Button } from 'antd'
import { IListItemInfo, IViewProps } from '../../plugins/template/Interface'
import { HandleResultDataType } from '../../plugins/template/Interface'

const App = () => {

  const [curPlugin, setCurPlugin] = useState<MicroApp>()

  const pRef = useRef<MicroApp>()

  const [viewList, setViewList] = useState<any[]>([])

  useEffect(() => {
    return () => {
      curPlugin?.unmount()
    }
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <Button onClick={() => {
          let microApp: any = null
          const addItemViews = (data: HandleResultDataType) => {
            console.log('addItemViews', data, microApp)

            const viewPropsList: IViewProps[] = []
            data.listItemInfos.forEach((itemInfo: IListItemInfo) => {
              const CID = 'Container' + Math.random()
              viewList.push({
                id: CID,
              })

              viewPropsList.push({
                containerId: CID,
                ...itemInfo,
              })
            })

            // 更新list数据，建立空的div
            setViewList([...viewList])

            // add view and set props to view
            if (pRef.current) {
              viewPropsList.forEach(props => {
                console.log('view props', props)
                setTimeout(() => pRef.current?.update?.(props).then(), 100)
              })
            }
          }

          microApp = loadMicroApp({
            name: 'DebugPlugin',
            entry: '//localhost:3000/plugin',
            container: '#pluginContainer',
            props: { onReceiveData: addItemViews, env:{} },
          })

          pRef.current = microApp
          setCurPlugin(microApp)
        }}>
          add plugin
        </Button>

        <br />

        {viewList.map(item => {
          return <div key={item.id} id={item.id}/>
        })}

      </header>
    </div>
  )
}

export default App
