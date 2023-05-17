import { Avatar, Divider, List, Popover, Space, Tag } from 'antd'
import { loadMicroApp } from 'qiankun'
import { MicroApp } from 'qiankun/es/interfaces'
import { Button, Input } from 'antd'
import { InstallParams } from '../../../gadgets/template/Interface'
import { HandleResultDataType } from '../../../gadgets/template/Interface'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

const { Search } = Input

/**
 * @author Jack Tony
 *
 * @date 2023/5/15
 */
export interface IProps {
  isCollapsed: boolean,

  onClickCollapse: () => void

  onGadgetChanged: (plugin: MicroApp) => void

  onReceiveViewData: (data: HandleResultDataType) => void
}

const data =
  [
    {
      'name': 'search',
      'icon': 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css',
      'description': 'Search the internet with Google',
    },
    {
      'name': 'calculator',
      'icon': 'https://use.fontawesome.com/releases/v5.7.2/svgs/solid/calculator.svg',
      'description': 'Perform simple calculations',
    },
    {
      'name': 'timer',
      'icon': 'https://use.fontawesome.com/releases/v5.7.2/svgs/solid/clock.svg',
      'description': 'Set timers',
    },
    {
      'name': 'todo',
      'icon': 'https://use.fontawesome.com/releases/v5.7.2/svgs/solid/check-circle.svg',
      'description': 'Manage tasks and to-do lists',
    },
    {
      'name': 'translate',
      'icon': 'https://use.fontawesome.com/releases/v5.7.2/svgs/solid/comment-dots.svg',
      'description': 'Translate text between languages',
    },
    {
      'name': 'weather',
      'icon': 'https://use.fontawesome.com/releases/v5.7.2/svgs/solid/sun.svg',
      'description': 'Check the current weather conditions',
    },
  ]

export default ({ isCollapsed, onClickCollapse, onGadgetChanged, onReceiveViewData }: IProps) => {

  return <div style={{ background: 'white', height: 50, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
    <Button
      type="text"
      icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      onClick={() => onClickCollapse()}
      style={{
        width: 50,
        height: 50,
      }}
    />

    <div style={{ display: 'flex', flex: 1 }}>
      <Avatar style={{ marginRight: 12 }} shape={'square'} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <a style={{ fontWeight: 600, fontSize: 15 }} href="https://homepage.com">{'DebugGadget'}</a>
        <span style={{ fontSize: 12, color: 'gray' }}>Debug Plugin</span>
      </div>
    </div>

    <Button
      style={{ marginLeft: 12 }}
      onClick={() => {
        // 初始化插件的参数
        const params: InstallParams = {
          onReceiveData: onReceiveViewData,
          envInfo: {}, // 环境信息，比如是否是浏览器、小程序、vscode插件等
        }

        const microApp = loadMicroApp({
          name: 'DebugGadget',
          entry: '//localhost:7031',
          container: '#gadgetContainer',
          props: params,
        }, {
          fetch(url, args) { // https://blog.csdn.net/sunqiang4/article/details/122014916
            window.fetch('http://localhost:7031/index.html')
              .then(response => response.text())
              .then(htmlString => {
                // 解析 HTML 字符串
                const parser = new DOMParser()
                const doc = parser.parseFromString(htmlString, 'text/html')

                // 获取 meta 标签数组
                const metaElements = doc.getElementsByTagName('meta')

                // 遍历 meta 标签数组，输出属性名和属性值
                for (let i = 0; i < metaElements.length; i++) {
                  const meta = metaElements[i]
                  console.log(meta.getAttribute('name') + ': ' + meta.getAttribute('content'))
                }
              })
              .catch(error => console.error(error))
            return window.fetch(url, args)
          },
        })

        onGadgetChanged(microApp)
      }}>
      init
    </Button>

    <Popover
      title="4th Dimensional Pocket"
      trigger="click"
      placement="bottomRight"
      content={
        <div style={{ width: 350 }}>

          <Divider style={{ margin: 12 }} />
          <Search
            style={{ marginBottom: 14, marginTop: 4 }}
            placeholder="input name of gadget"
            allowClear
            enterButton="Search"
            onSearch={() => {
            }} />

          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  title={<div>
                    <a href="https://ant.design">{item.name}</a>
                    <Space size={0} style={{marginLeft:8}}>
                    <Tag color="blue">Ant Design</Tag>
                    <Tag color="#5BD8A6">TechUI</Tag>
                  </Space></div>}
                  avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} shape={'square'} />}
                  description={item.description}
                />
              </List.Item>
            )}
          />

        </div>
      }
    >
      <Button
        style={{ marginLeft: 12, marginRight: 12 }}
        type={'primary'}>
        Switch Gadget
      </Button>
    </Popover>
  </div>
}

