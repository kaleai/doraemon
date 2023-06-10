import { Button, Card, Tabs, TabsProps } from 'antd'
import '../App.css'
import { MenuFoldOutlined, MenuUnfoldOutlined, RollbackOutlined } from '@ant-design/icons'

interface IProps {
  onClickClose: () => void
  isHide: boolean
}

export default (props: IProps) => {
  const { onClickClose, isHide } = props

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
        <Card style={{ marginTop: 22 }} title={'自定义'}>
          账户
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
      onChange={(key: string) => {
        console.log('key', key)
      }
      } />
  </div>
}
