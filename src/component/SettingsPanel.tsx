import { Button, Card, Spin, Tabs, TabsProps } from 'antd'

import { RollbackOutlined } from '@ant-design/icons'
import { IGlobalConfig } from '../interface'
import { loadMicroApp } from 'qiankun'

import '../App.css'
import React, { useState, useEffect } from 'react'

interface IProps {
  isHide: boolean
  globalConfig: IGlobalConfig
  onClickClose: () => void
}

const settingsContainerId = 'settings-container'

export default (props: IProps) => {
  const { isHide, globalConfig, onClickClose } = props

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (globalConfig.settings) {
      setLoading(true)
    }
  }, [])

  const loadSettingMicroApp = () => {
    if (!globalConfig.settings) {
      return false
    }

    loadMicroApp({
      name: 'doraemon-settings',
      entry: globalConfig.settings.url,
      container: '#' + settingsContainerId,
      props: {},
    }, {
      fetch(url, args) {
        return fetch(url, { ...args, mode: 'cors' })
      },
      sandbox: false,
    }).loadPromise.then(() => setLoading(false))


    return true
  }

  if (isHide) {
    return <></>
  }

  const items: TabsProps['items'] = [
    {
      key: 'COMMON',
      label: '通用设置',
      children: <div>
        <Card title={'基础'}>
          通用
        </Card>
        {
          loadSettingMicroApp() &&
          <Spin spinning={loading}>
            <Card style={{ marginTop: 22 }} title={globalConfig.settings.label}>
              <div id={settingsContainerId} />
            </Card>
          </Spin>
        }
      </div>,
    },
  ]

  return <div style={{ width: '100%' }}>
    <Tabs
      className={'mainContent'}
      style={{ width: '100%', height: '100%', paddingTop: 6, paddingLeft: 12, paddingRight: 12 }}
      tabBarExtraContent={{
        right: <Button icon={<RollbackOutlined />} type={'primary'} onClick={onClickClose}>返回</Button>,
      }}
      defaultActiveKey="COMMON"
      type={'card'}
      animated={true}
      tabBarGutter={12}
      items={items}
    />
  </div>
}
