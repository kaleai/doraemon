import { Avatar, Popover, Space } from 'antd'
import { MicroApp } from 'qiankun/es/interfaces'
import { Button } from 'antd'
import { ActionHandleResultType } from '../../gadget-template/Interface'
import { MenuFoldOutlined, MenuUnfoldOutlined, SwapOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { IGadgetInfo } from './GadgetDetail'
import { IGlobalConfig } from '../interface'
import useGadget from '../hooks/useGadget'
import GadgetsList from './GadgetsList'
import InstallGadgetDialog from './InstallGadgetDialog'
import { addGlobalUncaughtErrorHandler, removeGlobalUncaughtErrorHandler } from 'qiankun'

const DEF_GADGET_ICON = 'https://img0.baidu.com/it/u=2224311546,765801345&fm=253&fmt=auto&app=138&f=JPEG'

/**
 * @author Jack Tony
 *
 * @date 2023/5/15
 */
export interface IProps {

  isCollapsed: boolean,

  globalConfig: IGlobalConfig

  gadgetInfo?: IGadgetInfo

  onClickCollapse: () => void

  onGadgetChange: (info: IGadgetInfo, microApp?: MicroApp) => void

  onReceiveActionHandleResult: (data: ActionHandleResultType) => void
}

export default (
  {
    globalConfig,
    isCollapsed,
    gadgetInfo,
    onClickCollapse,
    onGadgetChange,
    onReceiveActionHandleResult,
  }: IProps) => {

  const [DlgVisible, setDlgVisible] = useState<boolean>(false)

  const [localGadgetInfos, setLocalGadgetInfos] = useState<IGadgetInfo[]>([])

  const { loading, queryGadgets, gadgetInfos } = useGadget(
    globalConfig, gadgetInfo, localGadgetInfos,
    onReceiveActionHandleResult, onGadgetChange)

  useEffect(() => {
    const errHandler = (args: any) => console.error(args)
    addGlobalUncaughtErrorHandler(errHandler)

    return () => {
      removeGlobalUncaughtErrorHandler(errHandler)
    }
  }, [])

  return <div
    className={'fullHeight'}
    style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
    <Space style={{ flex: 1, marginLeft: 12 }} size={12} align={'center'}>
      {/* 展开/收起的按钮 */}
      <Button
        style={{ width: 40, height: 40 }} type="text"
        icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onClickCollapse}
      />

      {/* 道具的icon */}
      <Avatar size={36} shape={'square'} src={gadgetInfo?.icon ?? DEF_GADGET_ICON} onClick={() => {
        if (!gadgetInfo) {
          onGadgetChange({ name: 'DebugGadget', entryUrl: '//localhost:7031' } as IGadgetInfo)
        }
      }} />

      {/* 名称 */}
      {gadgetInfo ?
        <a style={{ fontWeight: 500 }} href={gadgetInfo.homepage}>{gadgetInfo.name}</a>
        :
        <div style={{ color: 'gray' }}>{'请在右侧选择你需要的道具 →'}</div>
      }
    </Space>

    <InstallGadgetDialog
      visible={DlgVisible}
      onInstalled={info => {
        localGadgetInfos.push(info)
        setLocalGadgetInfos([...localGadgetInfos])
      }}
      onCancel={() => {
        setDlgVisible(false)
      }} />

    <Popover
      title={
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 4 }}>
          <span>四次元口袋</span>
          <div style={{ flex: 1 }} />
          <Button type={'link'} onClick={() => setDlgVisible(true)}>
            ✨ 安装新的道具
          </Button>
        </div>
      }
      trigger="click"
      placement="bottomRight"
      onOpenChange={(visible: boolean) => visible && queryGadgets()}
      content={
        <GadgetsList loading={loading} gadgetInfos={gadgetInfos} onItemSelect={onGadgetChange} />
      }
    >
      <Button style={{ margin: '0 12px' }} type={'primary'} icon={<SwapOutlined />}>
        切换道具
      </Button>
    </Popover>
  </div>
}

