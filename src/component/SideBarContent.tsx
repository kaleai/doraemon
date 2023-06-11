import {
  CommentOutlined, CompassFilled, CompassOutlined,
  GlobalOutlined, MessageFilled,
  SettingOutlined,
  StarFilled,
  UserOutlined,
} from '@ant-design/icons'
import {
  GithubFilled,
  InfoCircleFilled,
  PlusCircleFilled,
} from '@ant-design/icons'
import { Menu, Avatar, Space, Divider, Button } from 'antd'
import React from 'react'
import './index.css'


// import InfiniteScroll from 'react-infinite-scroll-component';

interface IProps {
  onClickSettings: () => void
}

/**
 * @author Jack Tony
 * @date 2023/5/15
 */
export default (props: IProps) => {
  const { onClickSettings } = props
  return <div>
    <div style={{ height: 110, paddingTop: 12, display: 'flex', flexDirection: 'column' }}>
      <Space style={{ marginLeft: 10 }}>
        <Avatar
          className={'userAvatar'}
          icon={<UserOutlined />}
          size={'large'}
          src={localStorage.getItem('doraemon_user_avatar')}
        />
        <span style={{ color: 'white' }}>{localStorage.getItem('doraemon_user_name')??'游客用户'}</span>
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
        defaultSelectedKeys={['1']}
        items={[
          {
            key: '1',
            label: 'write javascript code',
          },
          {
            key: '2',
            label: 'ask for sql helper',
          },
          {
            key: '3',
            label: 'write some note or todos',
          },
          {
            key: '4',
            label: 'give me help',
          },
          {
            key: '5',
            label: 'open the door in me',
          },
          {
            key: '6',
            label: 'Outlook Message',
          },
          {
            key: '7',
            label: 'PowerPoint Document',
          },
          {
            key: '8',
            label: 'Outlook Message',
          },
          {
            key: '9',
            label: 'Portable Document Format (PDF)',
          },
          {
            key: '10',
            label: 'Portable Document Format (PDF)',
          },
          {
            key: '11',
            label: 'Portable Document Format (PDF)',
          },
        ]}
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
        <CompassFilled className={'dynamicIcon'} />
        <MessageFilled className={'dynamicIcon'} />
        <GithubFilled className={'dynamicIcon'} onClick={() => {
          window.open('https://github.com/kaleai/doraemon')
        }} />
      </Space>
    </div>
  </div>
}
