import { Avatar, Divider, List, Modal, Popover, Space, Tag, Typography } from 'antd'
import { loadMicroApp } from 'qiankun'
import { MicroApp } from 'qiankun/es/interfaces'
import { Button, Input, message } from 'antd'
import { InstallProps, ActionHandleResultType } from '../../gadget-template/Interface'
import { MenuFoldOutlined, MenuUnfoldOutlined, SwapOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import GadgetDetail, { IGadgetInfo, queryGadgetInfo } from './GadgetDetail'
import { IGlobalConfig } from '../interface'
import { KEY } from '../constant'

const { Search } = Input

/**
 * @author Jack Tony
 *
 * @date 2023/5/15
 */
export interface IProps {

  isCollapsed: boolean,

  globalConfig: IGlobalConfig

  setGlobalLoading: (loading: boolean) => void

  onClickCollapse: () => void

  onGadgetChanged: (gadget: MicroApp) => void

  onReceiveActionHandleResult: (data: ActionHandleResultType) => void
}

export default ({ isCollapsed, globalConfig, onClickCollapse, onGadgetChanged, onReceiveActionHandleResult, setGlobalLoading }: IProps) => {

  const [curGadget, setCurGadget] = useState<IGadgetInfo>()

  const [gadgetList, setGadgetList] = useState<IGadgetInfo[]>([])

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const [installUrl, setInstallUrl] = useState<string | null>(null)

  useEffect(() => {
    const infoStr = localStorage.getItem(KEY.CURRENT_GADGET)
    infoStr && setCurGadget(JSON.parse(infoStr))
  }, [])

  useEffect(() => {
    if (curGadget !== undefined) {
      localStorage.setItem(KEY.CURRENT_GADGET, JSON.stringify(curGadget))
    }
  }, [curGadget])

  /**
   * 加载道具列表
   */
  const loadGadgetList = () => {
    const gadgets = globalConfig.gadgets
    const promiseList = gadgets.map(gadget => {
      return queryGadgetInfo(gadget.url)
    })

    Promise.all(promiseList)
      .then(infos => {
        setGadgetList(infos)
      })
      .catch(err => {
        console.error(err)
        message.error({ content: '道具加载异常' })
      })
  }

  /**
   * 安装道具应用
   */
  const installGadgetApp = (name: string, entryUrl: string) => {
    setGlobalLoading(true)
    // 初始化插件的参数
    const initProps: InstallProps = {
      gid: '2efefadsfdas',
      onReceiveActionHandleResult,
      envInfo: {}, // 环境信息，比如是否是浏览器、小程序、vscode插件等
    }

    const gadget = loadMicroApp({
      name: name,
      entry: entryUrl,
      container: '#gadgetContainer',
      props: initProps,
    }, {
      /*fetch(url, args) { // https://blog.csdn.net/sunqiang4/article/details/122014916
        return window.fetch(url, args)
      },*/
      sandbox: false,
    })

    gadget.mountPromise.then(res => {
      onGadgetChanged(gadget)
    })

    gadget.loadPromise.then(res => {
      console.log('kale- loadPromise', res)
      setGlobalLoading(false)
    })
  }

  return <div style={{ background: 'white', height: 60, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
    {/* 展开/收起的按钮 */}
    <Button
      style={{ width: 40, height: 40, margin: 8 }}
      type="text"
      icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      onClick={() => onClickCollapse()}
    />

    {curGadget ?
      <Space style={{ flex: 1 }} size={'middle'}>
        <Avatar
          style={{ minWidth: 30 }}
          size={30}
          shape={'square'} src={curGadget.icon}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <a style={{ fontWeight: 600, fontSize: 15 }} href={curGadget.homepage}>{curGadget.name}</a>
          <span style={{ fontSize: 12, color: 'gray' }}>{curGadget.description}</span>
        </div>
      </Space>
      :
      <Space style={{ flex: 1 }}>
        <Avatar
          style={{ marginRight: 12 }} shape={'square'} size={'default'}
          src={'https://img0.baidu.com/it/u=2224311546,765801345&fm=253&fmt=auto&app=138&f=JPEG'}
          onClick={() => {
            installGadgetApp('local', '//localhost:7031')
          }}
        />
      </Space>
    }

    <Modal
      title="Install New Gadget" open={isModalOpen}
      okText={'Install'}
      zIndex={9999}
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
      title={
        <div>
          <span>4th Dimensional Pocket</span>
          <Button type={'link'} onClick={() => {
            setIsModalOpen(true)
          }}>
            Install New Gadget
          </Button>
        </div>
      }
      trigger="click"
      placement="bottomRight"
      onVisibleChange={(visible: boolean) => {
        if (visible) {
          setGadgetList([])
          loadGadgetList()
        }
      }}
      content={
        <div style={{ width: 325 }}>
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
            loading={gadgetList.length === 0}
            renderItem={(item, index) => (
              <List.Item actions={[
                <Button
                  type={'link'}
                  key="action-link"
                  onClick={() => {
                    console.log('install gadget', item)

                    installGadgetApp(item.name, item.entryUrl)
                    setCurGadget(item)
                  }}
                >
                  Select
                </Button>,
              ]}
              >
                <List.Item.Meta
                  title={<a href={item.homepage}>{item.name}</a>}
                  avatar={<Avatar src={item.icon} shape={'square'} />}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </div>
      }
    >
      <Button
        style={{ margin: '0 12px' }}
        type={'primary'}
        icon={<SwapOutlined />}
      >
        Switch Gadget
      </Button>
    </Popover>
  </div>
}

