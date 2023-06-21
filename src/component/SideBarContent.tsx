import {
  CompassFilled,
  DownloadOutlined,
  MessageFilled,
  MoneyCollectOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  GithubFilled,
  PlusCircleFilled,
} from '@ant-design/icons'
import { Menu, Avatar, Space, Button, Tooltip, Modal } from 'antd'
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
      <a className={'dynamicIcon'} href={cfgInfo.url} target={'_blank'}>
        {icon}
      </a>
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

        <Button
          className={'transparentBtn'}
          style={{ opacity: '0.8', width: 25 }}
          type={'default'}
          size={'small'}
          icon={<SettingOutlined />}
          onClick={onClickSettings}
        />
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

    <div style={{ height: 90, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Space>
        {globalConfig.download &&
        <Button
          className={'fullWidth'}
          type={'primary'}
          style={{ backgroundColor: '#52c41a', fontWeight: 'bold' }}
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
          className={'fullWidth'}
          type={'primary'}
          style={{ backgroundColor: '#eb2f96', fontWeight: 'bold' }}
          icon={<MoneyCollectOutlined />}
          onClick={() => {
            if (globalConfig.donate.url) {
              window.open(globalConfig.donate.url)
            } else {
              Modal.success({
                title: '向作者投币买个饭团吧 🍙',
                width: 600,
                content:
                  <Space direction={'vertical'}>
                    <span>如您需要进入项目的鸣谢名单，捐赠后可以发送金额到kaleai@qq.com，十分感谢！</span>
                    <img width={500} src="/donate.jpg" alt="donate" />
                  </Space>,
              })
            }
          }}
        >
          {globalConfig.donate.label}
        </Button>
        }
      </Space>

      <Space style={{ color: 'white', fontSize: 17, marginLeft: 16, marginTop: 12 }} size={'small'}>
        <span style={{ marginRight: 2, fontWeight: 'bold' }}>{globalConfig.title}</span>
        {renderEntranceIcon(<CompassFilled />, globalConfig.website.home)}
        {renderEntranceIcon(<MessageFilled />, globalConfig.website.discuss)}
        {renderEntranceIcon(<GithubFilled />, globalConfig.website.github)}
      </Space>
    </div>
  </div>
}
