import { Avatar, Divider, List, Popover, Space, Tag } from 'antd'
import { loadMicroApp } from 'qiankun'
import { MicroApp } from 'qiankun/es/interfaces'
import { Button, Input } from 'antd'
import { InstallParams } from '../../../gadgets/template/Interface'

import { ConversationDataType } from '../../../gadgets/template/Interface'
import { MenuFoldOutlined, MenuUnfoldOutlined, SwapOutlined } from '@ant-design/icons'

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

  onReceiveConversationData: (data: ConversationDataType) => void
}

const data =
  [
    {
      'name': 'Manorlead',
      'icon': 'https://aix4u.notion.site/image/https%3A%2F%2Fchatgpt.vipmanor.com%2Flogo.png?id=d2bbbfa3-ae1b-417c-8134-b3006c78ea60&table=block&spaceId=a9c35667-3cbe-48c4-8afd-77c2276cae19&width=600&userId=&cache=v2',
      'description':  'Search the internet with Google',
    },
    {
      'name': 'MixerBox OnePlayer',
      'icon': 'https://aix4u.notion.site/image/https%3A%2F%2Fwww.mbplayer.com%2Ffavicon-app_store_icon.png?id=49634678-4dd4-461b-a50a-492c041681ed&table=block&spaceId=a9c35667-3cbe-48c4-8afd-77c2276cae19&width=600&userId=&cache=v2',
      'description': 'Perform simple calculations',
    },
    {
      'name': 'timer',
      'icon': 'https://aix4u.notion.site/image/https%3A%2F%2Fchat.noteable.io%2Forigami%2Fstatic%2Fimages%2Fnoteable-logo.png?id=dcd44917-03a3-4534-ab2a-9df42355f235&table=block&spaceId=a9c35667-3cbe-48c4-8afd-77c2276cae19&width=600&userId=&cache=v2',
      'description': 'Set timers',
    },
    {
      'name': 'todo',
      'icon': 'https://aix4u.notion.site/image/https%3A%2F%2Fplaylistai-plugin.vercel.app%2Ficon.png?id=c177cddb-3c88-4d75-9908-f08de53d8341&table=block&spaceId=a9c35667-3cbe-48c4-8afd-77c2276cae19&width=600&userId=&cache=v2',
      'description': 'Manage tasks and to-do lists',
    },
    {
      'name': 'translate',
      'icon': 'https://aix4u.notion.site/image/https%3A%2F%2Fcdn.otstatic.com%2Fthird-party%2Fimages%2Fopentable-logo-512.png?id=be330ee7-8f0b-42f9-b8c5-8599ec9824a8&table=block&spaceId=a9c35667-3cbe-48c4-8afd-77c2276cae19&width=600&userId=&cache=v2',
      'description': 'Translate text between languages',
    },
    {
      'name': 'weather',
      'icon': 'https://aix4u.notion.site/image/https%3A%2F%2Fpolygon.io%2Fimgs%2Ffavicon.png?id=547707e8-3a82-446e-a1d6-1baefec80205&table=block&spaceId=a9c35667-3cbe-48c4-8afd-77c2276cae19&width=600&userId=&cache=v2',
      'description': 'Check the current weather conditions',
    },
  ]

export default ({ isCollapsed, onClickCollapse, onGadgetChanged, onReceiveConversationData }: IProps) => {

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
      <Avatar style={{ marginRight: 12 }} shape={'square'} src={'https://img0.baidu.com/it/u=2224311546,765801345&fm=253&fmt=auto&app=138&f=JPEG'}/>
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
          onReceiveConversationData,
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
              <List.Item actions={[<a key="list-loadmore-edit">install</a>, <a key="list-loadmore-more">more</a>]}>
                <List.Item.Meta
                  title={
                    <a href="https://ant.design">{item.name}</a>}
                  avatar={<Avatar src={item.icon} shape={'square'} />}
                  description={<div>
                    <Space size={[0, 8]} wrap>
                      <Tag color="blue">Ant Design</Tag>
                      <Tag color="#5BD8A6">TechUI</Tag>
                    </Space>
                    {item.description}
                </div>}
                />
              </List.Item>
            )}
          />

        </div>
      }
    >
      <Button
        style={{ marginLeft: 12, marginRight: 12 }}
        type={'primary'}
        icon={<SwapOutlined />}
      >
        Switch Gadget
      </Button>
    </Popover>
  </div>
}

