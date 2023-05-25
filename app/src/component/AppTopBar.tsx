import { Avatar, Divider, List, Modal, Popover, Space, Tag } from 'antd'
import { loadMicroApp } from 'qiankun'
import { MicroApp } from 'qiankun/es/interfaces'
import { Button, Input } from 'antd'
import { InstallParams } from '../../../gadgets/template/Interface'

import { ConversationDataType } from '../../../gadgets/template/Interface'
import { MenuFoldOutlined, MenuUnfoldOutlined, SwapOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import GadgetDetail, { IGadgetInfo } from './GadgetDetail'

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

const data: IGadgetInfo[] =
  [
    {
      id: 'dfsddfasdfsda',
      'name': 'md5',
      'icon': 'https://aix4u.notion.site/image/https%3A%2F%2Fpolygon.io%2Fimgs%2Ffavicon.png?id=547707e8-3a82-446e-a1d6-1baefec80205&table=block&spaceId=a9c35667-3cbe-48c4-8afd-77c2276cae19&width=600&userId=&cache=v2',
      'description': 'small tools for md5',
      version: '1',
      entryUrl: '//localhost:7031',
    },
    {
      id: 'dfsddfasdfsdafsdaf',
      'name': 'Manorlead',
      'icon': 'https://aix4u.notion.site/image/https%3A%2F%2Fchatgpt.vipmanor.com%2Flogo.png?id=d2bbbfa3-ae1b-417c-8134-b3006c78ea60&table=block&spaceId=a9c35667-3cbe-48c4-8afd-77c2276cae19&width=600&userId=&cache=v2',
      'description': 'Search the internet with Google',
      version: '1',
      entryUrl: '//localhost:7031',
    },
    {
      id: 'dfsddfasdfsdaf111',
      'name': 'MixerBox OnePlayer',
      'icon': 'https://aix4u.notion.site/image/https%3A%2F%2Fwww.mbplayer.com%2Ffavicon-app_store_icon.png?id=49634678-4dd4-461b-a50a-492c041681ed&table=block&spaceId=a9c35667-3cbe-48c4-8afd-77c2276cae19&width=600&userId=&cache=v2',
      'description': 'Perform simple calculations',
      version: '1',
      entryUrl: '//localhost:7031',
    },
    {
      id: 'dfsddfasdfsr22e423dafsdaf',
      'name': 'timer',
      'icon': 'https://aix4u.notion.site/image/https%3A%2F%2Fchat.noteable.io%2Forigami%2Fstatic%2Fimages%2Fnoteable-logo.png?id=dcd44917-03a3-4534-ab2a-9df42355f235&table=block&spaceId=a9c35667-3cbe-48c4-8afd-77c2276cae19&width=600&userId=&cache=v2',
      'description': 'Set timers',
      version: '1',
      entryUrl: '//localhost:7031',
    },
    {
      id: 'df899sdfsdsddfasdfsdafsdaf',
      'name': 'weather',
      'icon': 'https://aix4u.notion.site/image/https%3A%2F%2Fpolygon.io%2Fimgs%2Ffavicon.png?id=547707e8-3a82-446e-a1d6-1baefec80205&table=block&spaceId=a9c35667-3cbe-48c4-8afd-77c2276cae19&width=600&userId=&cache=v2',
      version: '1',
      'description': 'Check the current weather conditions',
      entryUrl: '//localhost:7031',
    },
  ]

export default ({ isCollapsed, onClickCollapse, onGadgetChanged, onReceiveConversationData }: IProps) => {

  const [curGadget, setCurGadget] = useState<IGadgetInfo>()

  const [gadgetList, setGadgetList] = useState<IGadgetInfo[]>(data)

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const [installUrl, setInstallUrl] = useState<string | null>(null)

  useEffect(() => {
    const info = localStorage.getItem('currentGadget') as (IGadgetInfo | null)
    if (info) {
      setCurGadget(info)
    }

    /*const list = localStorage.getItem('gadgetList') as (IGadgetInfo[] | null)
    if (list) {
      setGadgetList(list)
    } else {
      localStorage.setItem('gadgetList', JSON.stringify(data))
      setGadgetList(data)
    }*/
  }, [])

  const loadGadget = (name: string, entryUrl: string) => {
    // 初始化插件的参数
    const params: InstallParams = {
      onReceiveConversationData,
      envInfo: {}, // 环境信息，比如是否是浏览器、小程序、vscode插件等
    }

    const microApp = loadMicroApp({
      name: name,
      entry: entryUrl,
      container: '#gadgetContainer',
      props: params,
    }, {
      fetch(url, args) { // https://blog.csdn.net/sunqiang4/article/details/122014916
        return window.fetch(url, args)
      },
    })

    onGadgetChanged(microApp)
  }

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

    {curGadget ?
      <div style={{ display: 'flex', flex: 1 }}>
        <Avatar style={{ marginRight: 12 }} shape={'square'} src={curGadget.icon} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <a style={{ fontWeight: 600, fontSize: 15 }} href={curGadget.homepage}>{curGadget.name}</a>
          <span style={{ fontSize: 12, color: 'gray' }}>{curGadget.description}</span>
        </div>
      </div> : <div style={{ display: 'flex', flex: 1 }}>
        <Avatar style={{ marginRight: 12 }} shape={'square'}
                src={'https://img0.baidu.com/it/u=2224311546,765801345&fm=253&fmt=auto&app=138&f=JPEG'} /></div>}

    <Modal title="Basic Modal" open={isModalOpen}
           okText={'Install'}
           onCancel={() => {
             setIsModalOpen(false)
             setInstallUrl(null)
           }} onOk={() => {
      setInstallUrl(null)
      // TODO by kale: 2023/5/25 install gadget
    }}>
      <Input.Search style={{ marginBottom: 12 }} defaultValue={'http://localhost:7031'} onSearch={url => {
        setInstallUrl(url)
      }} />

      {installUrl && <GadgetDetail entryUrl={installUrl} />}
    </Modal>

    <Popover
      title={<div><span>4th Dimensional Pocket</span><Button type={'link'} onClick={() => {
        setIsModalOpen(true)
      }
      }>Install More</Button></div>}
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
            }}
          />

          <List
            itemLayout="horizontal"
            dataSource={gadgetList}
            renderItem={(item, index) => (
              <List.Item actions={[<a key="list-loadmore-edit" onClick={() => {
                loadGadget(item.name, item.entryUrl)
                setCurGadget(item)
              }}>select</a>,
              ]}>
                <List.Item.Meta
                  title={<a href={item.homepage}>{item.name}</a>}
                  avatar={<Avatar src={item.icon} shape={'square'} />}
                  description={<div>
                    <Space size={[0, 8]} wrap>
                      <Tag color="blue">Ant</Tag>
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

