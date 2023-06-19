import { Button, Card, Tabs, TabsProps } from 'antd'

import { RollbackOutlined } from '@ant-design/icons'
import { IGlobalConfig } from '../interface'
import { loadMicroApp } from 'qiankun'

import '../App.css'

interface IProps {
  isHide: boolean
  globalConfig: IGlobalConfig
  onClickClose: () => void
}

const settingsContainerName = 'settingsContainer'

export default (props: IProps) => {
  const { isHide, globalConfig, onClickClose } = props

  const loadSettingMicroApp = () => {
    loadMicroApp({
      name: 'doraemon-settings',
      entry: 'http://localhost:7031',
      container: '#' + settingsContainerName,
      props: {},
    }, {
      /*fetch(url, args) { // https://blog.csdn.net/sunqiang4/article/details/122014916
        return window.fetch(url, args)
      },*/
      sandbox: false,
    })
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
        <Card style={{ marginTop: 22 }} title={globalConfig.settings.label}>
          {loadSettingMicroApp() && <div id={settingsContainerName} />}
        </Card>
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
