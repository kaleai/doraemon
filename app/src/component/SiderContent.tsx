/**
 * @author Jack Tony
 *
 * @date 2023/5/15
 */
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
export default ()=>{
  return <Menu
    theme="dark"
    mode="inline"
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
    ]}
  />
}
