import {
  CompassFilled,
  DownloadOutlined,
  MessageFilled,
  MoneyCollectOutlined,
  SettingOutlined,
  UserOutlined,
  GithubFilled,
  PlusCircleFilled,
} from '@ant-design/icons'
import { Menu, Avatar, Space, Button, Tooltip } from 'antd'
import React from 'react'
import { KEY } from '../constant'
import './index.css'
import { IConfigEntry, IGlobalConfig } from '../interface'
import { showDonateDialog } from './DonateDialog'

interface IProps {
  globalConfig: IGlobalConfig
  onClickSettings: () => void
}

// 下面加起来必须是200
const HEIGHT_TOP_BAR = 116
const HEIGHT_BOTTOM_BAR = 84

/**
 * @author Jack Tony
 * @date 2023/5/15
 */
export default (props: IProps) => {
  const { globalConfig, onClickSettings } = props

  const [showDonateModal, setShowDonateModal] = React.useState<boolean>(false)

  /**
   * 渲染外部跳转网站的ICON
   */
  const renderEntranceIcon = (icon: any, cfgInfo?: IConfigEntry) => {
    if (!cfgInfo) {
      return null
    }

    return <Tooltip title={cfgInfo.label}>
      <a className={'dynamicIcon'} href={cfgInfo.url} target={'_blank'}>
        {icon}
      </a>
    </Tooltip>
  }

  const mockMenuListData = () => {
    const list = []
    for (let i = 0; i < 20; i++) {
      list.push({
        key: 'key_' + i,
        label: '🚧 To be developed and completed',
      })
    }
    return list
  }

  return <div>
    {showDonateModal &&
      <canvas
        id={'fireworks_canvas'} className={'fireworksCanvas'}
        style={{ width: window.innerWidth, height: window.innerHeight }}
      />
    }

    <div style={{ height: HEIGHT_TOP_BAR, paddingTop: 12, display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginLeft: 10, display: 'flex', alignItems: 'center' }}>
        <Avatar
          className={'userAvatar'}
          icon={<UserOutlined />}
          size={'large'}
          src={localStorage.getItem(KEY.USER_AVATAR)}
        />

        <span style={{ color: 'white', flex: 1, marginLeft: 12 }}>
          {localStorage.getItem(KEY.USER_NAME) ?? '游客用户'}
        </span>

        <Button
          className={'transparentBtn'}
          style={{ opacity: '0.8', width: 25 }}
          type={'default'}
          size={'small'}
          icon={<SettingOutlined />}
          onClick={onClickSettings}
        />
      </div>

      <Button
        className={'transparentBtn'}
        type={'default'}
        icon={<PlusCircleFilled />}
        onClick={()=>{
          alert('🚧🚧🚧 未完成，施工中 🚧🚧🚧')}}
      >
        新会话
      </Button>
    </div>

    <div className={'sideBarContent'}>
      <Menu
        style={{ flex: 1 }}
        theme="dark"
        defaultSelectedKeys={['key_1']}
        items={mockMenuListData()}
      />
    </div>

    <div style={{ height: HEIGHT_BOTTOM_BAR, display: 'flex', flexDirection: 'column' }}>
      <div className={'fullWidth'} style={{ marginTop: 12, display: 'flex' }}>
        {globalConfig.download &&
          <Button
            className={'fullWidth bottomButton'}
            style={{ backgroundColor: '#52c41a' }}
            type={'primary'}
            icon={<DownloadOutlined />}
            onClick={() => {
              window.open(globalConfig.download.url)
            }}
          >
            {globalConfig.download.label}
          </Button>
        }

        {globalConfig.donate &&
          <Button
            className={'fullWidth bottomButton'}
            style={{ backgroundColor: '#eb2f96' }}
            type={'primary'}
            icon={<MoneyCollectOutlined />}
            onClick={() => {
              if (globalConfig.donate.url) {
                window.open(globalConfig.donate.url)
              } else {
                setShowDonateModal(true)
                showDonateDialog(() => setShowDonateModal(false))
              }
            }}
          >
            {globalConfig.donate.label}
          </Button>
        }
      </div>

      <Space style={{ color: 'white', fontSize: 17, marginLeft: 16, marginTop: 12 }} size={'small'}>
        <span style={{ marginRight: 2, fontWeight: 'bold' }}>{globalConfig.title ?? 'Doraemon'}</span>
        {renderEntranceIcon(<CompassFilled />, globalConfig.website.home)}
        {renderEntranceIcon(<MessageFilled />, globalConfig.website.discuss)}
        {renderEntranceIcon(<GithubFilled />, globalConfig.website.github)}
      </Space>
    </div>
  </div>
}
