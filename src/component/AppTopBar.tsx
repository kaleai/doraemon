import { Avatar, Divider, List, Modal, Popover, Space } from 'antd'
import { loadMicroApp } from 'qiankun'
import { MicroApp } from 'qiankun/es/interfaces'
import { Button, Input, message, Typography } from 'antd'
import { InstallProps, ActionHandleResultType } from '../../gadget-template/Interface'
import { MenuFoldOutlined, MenuUnfoldOutlined, SwapOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import GadgetDetail, { IGadgetInfo, queryGadgetInfo } from './GadgetDetail'
import { IGlobalConfig } from '../interface'
import { nanoid } from 'nanoid'
import { KEY } from '../constant'

const md5 = require('js-md5')

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

export default (
  {
    globalConfig,
    isCollapsed,
    setGlobalLoading,
    onClickCollapse,
    onGadgetChanged,
    onReceiveActionHandleResult,
  }: IProps) => {

  const [curGadgetInfo, setCurGadgetInfo] = useState<IGadgetInfo>()

  const [gadgetInfoList, setGadgetInfoList] = useState<IGadgetInfo[]>([])

  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false)

  const [installUrl, setInstallUrl] = useState<string>()

  const [willBeInstallGadgetInfo, setWillBeInstallGadgetInfo] = useState<IGadgetInfo>()

  const [localGadgetInfoList, setLocalGadgetInfoList] = useState<IGadgetInfo[]>([])

  useEffect(() => {
    // get before gadget info and install
    const gadgetInfoStr = localStorage.getItem(KEY.CURRENT_GADGET)
    if (gadgetInfoStr && gadgetInfoStr !== 'undefined') {
      const info = JSON.parse(gadgetInfoStr) as IGadgetInfo
      installGadgetApp(info.name, info.entryUrl)
      setCurGadgetInfo(info)
    }

    // get local gadgets
    const localGadgetListStr = localStorage.getItem(KEY.LOCAL_GADGET_LIST)
    if (localGadgetListStr && localGadgetListStr !== 'undefined') {
      setLocalGadgetInfoList(JSON.parse(localGadgetListStr))
    }
  }, [])

  useEffect(() => {
    if (curGadgetInfo) {
      localStorage.setItem(KEY.CURRENT_GADGET, JSON.stringify(curGadgetInfo))
    }
  }, [curGadgetInfo])

  useEffect(() => {
    if (localGadgetInfoList?.length > 0) {
      localStorage.setItem(KEY.LOCAL_GADGET_LIST, JSON.stringify(localGadgetInfoList))
    }
  }, [localGadgetInfoList])

  /**
   * 加载道具信息列表
   */
  const loadGadgetInfoList = () => {
    const gadgets = globalConfig.gadgets
    const promiseList = gadgets.map(gadget => {
      return queryGadgetInfo(gadget.url)
    })

    Promise.all(promiseList)
      .then(infos => {
        // TODO by kale: 2023/6/21 list根据name去重
        const fullList = infos.concat(localGadgetInfoList)
        setGadgetInfoList(fullList)
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
      gid: nanoid(24),
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

    gadget.mountPromise.then(() => onGadgetChanged(gadget))
    gadget.loadPromise.then(() => {
      setIsInstallModalOpen(false)
      setGlobalLoading(false)
    })
  }

  const renderInfoListView = () =>
    <Popover
      title={
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 4 }}>
          <span>四次元口袋</span>
          <div style={{ flex: 1 }} />
          <Button type={'link'} onClick={() => setIsInstallModalOpen(true)}>
            🪄 安装新的道具
          </Button>
        </div>
      }
      trigger="click"
      placement="bottomRight"
      onOpenChange={(visible: boolean) => {
        if (visible) {
          setGadgetInfoList([])
          loadGadgetInfoList()
        }
      }}
      content={
        <div style={{ width: 325 }}>
          <Divider style={{ margin: 12 }} />
          <Search
            style={{ marginBottom: 14, marginTop: 4 }}
            placeholder="道具名称（支持模糊搜索）"
            allowClear
            enterButton="Search"
            onSearch={() => {
              // TODO by kale: 2023/6/21 搜索
            }}
          />

          <List
            itemLayout="horizontal"
            dataSource={gadgetInfoList}
            loading={gadgetInfoList.length === 0}
            renderItem={(item, index) => (
              <List.Item actions={[
                <Button
                  type={'primary'}
                  ghost
                  size={'small'}
                  key="action-link"
                  onClick={() => {
                    console.log('install gadget', item)
                    installGadgetApp(item.name, item.entryUrl)
                    setCurGadgetInfo(item)
                  }}
                >
                  选用
                </Button>,
              ]}
              >
                <List.Item.Meta
                  title={<a href={item.homepage}>{item.name}</a>}
                  avatar={<Avatar src={item.icon} shape={'square'} />}
                  description={
                    <div>
                      {item.description}
                      <a
                        style={{ color: '#1677ff', marginLeft: 6 }}
                        onClick={() => {
                          Modal.info({
                            title: '道具详情',
                            width: 800,
                            content: <GadgetDetail entryUrl={item.entryUrl} />,
                          })
                        }}>
                        {'更多>'}
                      </a>
                    </div>}
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
        切换道具
      </Button>
    </Popover>

  return <div style={{ background: 'white', height: 60, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
    {/* 展开/收起的按钮 */}
    <Button
      style={{ width: 40, height: 40, margin: 8 }}
      type="text"
      icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      onClick={() => onClickCollapse()}
    />

    {/* 道具icon + 名字 + 描述 */}
    {curGadgetInfo ?
      <Space style={{ flex: 1 }} size={'middle'}>
        <Avatar size={36} shape={'square'} src={curGadgetInfo.icon} />
        <Space direction={'vertical'} size={3}>
          <a style={{ fontWeight: 500, fontSize: 15 }} href={curGadgetInfo.homepage}>{curGadgetInfo.name}</a>
          <span style={{ fontSize: 12, color: 'gray' }}>{curGadgetInfo.description}</span>
        </Space>
      </Space>
      :
      <Space style={{ flex: 1 }}>
        <Avatar
          shape={'square'} size={'default'}
          src={'https://img0.baidu.com/it/u=2224311546,765801345&fm=253&fmt=auto&app=138&f=JPEG'}
          onClick={() => {
            installGadgetApp('local', '//localhost:7031')
          }}
        />
        <Typography.Text style={{ color: 'gray' }} ellipsis={true}>{'请在右侧选择你需要的道具 →'}</Typography.Text>
      </Space>
    }

    <Modal
      title="安装新道具"
      open={isInstallModalOpen}
      zIndex={1060}
      footer={
        willBeInstallGadgetInfo
          ?
          <Button
            type={'primary'}
            onClick={() => {
              if (willBeInstallGadgetInfo.name) {
                localGadgetInfoList.push(willBeInstallGadgetInfo)
                setLocalGadgetInfoList([...localGadgetInfoList])

                installGadgetApp(willBeInstallGadgetInfo.name, willBeInstallGadgetInfo.entryUrl)
              } else {
                message.error('gadget name is null')
              }
            }}>
            安装
          </Button>
          :
          null
      }
      onCancel={() => setIsInstallModalOpen(false)}
    >
      <Input.Search
        style={{ marginBottom: 12 }}
        defaultValue={'http://localhost:7031'}
        placeholder={'请输入道具的网址'}
        onSearch={url => setInstallUrl(url)}
      />

      {installUrl &&
        <GadgetDetail
          entryUrl={installUrl}
          onLoadSuccess={(info) => setWillBeInstallGadgetInfo(info)}
        />}
    </Modal>

    {renderInfoListView()}
  </div>
}

