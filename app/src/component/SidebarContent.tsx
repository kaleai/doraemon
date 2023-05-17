import {
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
import { Menu, Avatar, Space, Divider } from 'antd'
import React from 'react'


/**
 * @author Jack Tony
 * @date 2023/5/15
 */
export default () => {
  return <div style={{ paddingTop: 12, paddingBottom: 12, display: 'flex', flexDirection: 'column', height: '100%' }}>

    <div style={{ marginTop: 8, marginBottom: 8 }}>
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
          icon: <UserOutlined />,
          label: 'nav 1',
        },
        {
          key: '2',
          icon: <VideoCameraOutlined />,
          label: 'nav 2',
        },
        {
          key: '3',
          icon: <UploadOutlined />,
          label: 'nav 3',
        },
        {
          key: '4',
          icon: <PlusCircleFilled />,
          label: 'nav 4',
        },
      ]}
    />

    <Space style={{ color: 'white', fontSize: '18px', marginLeft: 18 }} size={'middle'}>
      <span style={{ marginRight: 2 }}>Doraemon</span>
      <InfoCircleFilled key="InfoCircleFilled" />
      <QuestionCircleFilled key="QuestionCircleFilled" />
      <GithubFilled key="GithubFilled" />
    </Space>
  </div>
}
