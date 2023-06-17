import {
  CommentOutlined, CompassFilled, CompassOutlined,
  GlobalOutlined, MessageFilled,
  SettingOutlined,
  StarFilled,
  UserOutlined,
} from '@ant-design/icons'
import {
  GithubFilled,
  PlusCircleFilled,
} from '@ant-design/icons'
import { Menu, Avatar, Space, Button, Tooltip } from 'antd'
import React from 'react'
import { KEY } from '../constant'
import './index.css'
import { IConfigEntry, IGlobalConfig } from '../interface'


// import InfiniteScroll from 'react-infinite-scroll-component';

interface IProps {
  globalConfig: IGlobalConfig
  onClickSettings: () => void
}

/**
 * @author Jack Tony
 * @date 2023/5/15
 */
export default (props: IProps) => {
  const { globalConfig, onClickSettings } = props

  /**
   * 渲染外部跳转网站的ICON
   */
  const renderEntranceIcon = (icon: any, cfgInfo?: IConfigEntry) => {
    if (!cfgInfo) {
      return null
    }
    return <Tooltip title={cfgInfo.label}>
      <div className={'dynamicIcon'} onClick={() => {
        window.open(cfgInfo.url)
      }}>
        {icon}
      </div>
    </Tooltip>
  }

  const mockMenuListData = () => {
    const list = []
    for (let i = 0; i < 10; i++) {
      list.push({
        key: 'key_' + i,
        label: 'write javascript code',
      })
    }
    return list
  }

  return <div>
    <div style={{ height: 110, paddingTop: 12, display: 'flex', flexDirection: 'column' }}>
      <Space style={{ marginLeft: 10 }}>
        <Avatar
          className={'userAvatar'}
          icon={<UserOutlined />}
          size={'large'}
          src={localStorage.getItem(KEY.USER_AVATAR)}
        />
        <span style={{ color: 'white' }}>{localStorage.getItem(KEY.USER_NAME) ?? '游客用户'}</span>
      </Space>

      <Button
        className={'transparentBtn'}
        type={'default'}
        icon={<PlusCircleFilled />}
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

    <div style={{ height: 90, display: 'flex', flexDirection: 'column' }}>
      <Button
        className={'transparentBtn'}
        style={{ opacity: '0.8' }}
        type={'default'}
        icon={<SettingOutlined />}
        onClick={onClickSettings}>
        设置
      </Button>

      <Space style={{ color: 'white', fontSize: 17, marginLeft: 16 }} size={'small'}>
        <span style={{ marginRight: 2, fontWeight: 'bold' }}>Doraemon</span>
        {renderEntranceIcon(<CompassFilled />, globalConfig.website.home)}
        {renderEntranceIcon(<MessageFilled />, globalConfig.website.discuss)}
        {renderEntranceIcon(<GithubFilled />, globalConfig.website.github)}
      </Space>
    </div>
  </div>
}
