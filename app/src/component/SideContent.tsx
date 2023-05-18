import {
  SettingOutlined,
  ShareAltOutlined,
  StarFilled,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import {
  CaretDownFilled,
  DoubleRightOutlined,
  GithubFilled,
  InfoCircleFilled,
  LogoutOutlined,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined,
} from '@ant-design/icons'
import { Menu, Avatar, Space, Divider, Button } from 'antd'
import React from 'react'


/**
 * @author Jack Tony
 * @date 2023/5/15
 */
export default () => {
  return <div style={{ paddingTop: 12, paddingBottom: 12, display: 'flex', flexDirection: 'column', height: '100%' }}>

    <div style={{ margin: 8 }}>
      <Avatar shape="square" icon={<UserOutlined />} size={'large'} />
      <span style={{ color: 'white' }}>UserName</span>
    </div>

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
      ]}
    />

    <Button style={{ margin: 12, background: 'transparent', color: 'white' }} type={'default'} icon={<SettingOutlined />}>Settings</Button>

    <Space style={{ color: 'white', fontSize: '18px', marginLeft: 18 }} size={'middle'}>
      <span style={{ marginRight: 2, fontWeight: 'bold' }}>Doraemon</span>
      <InfoCircleFilled key="InfoCircleFilled" />
      <StarFilled key="QuestionCircleFilled" />
      <GithubFilled key="GithubFilled" />
    </Space>
  </div>
}
