import { Avatar, Popover, Space } from 'antd'
import { MicroApp } from 'qiankun/es/interfaces'
import { Button, Typography } from 'antd'
import { ActionHandleResultType } from '../../gadget-template/Interface'
import { MenuFoldOutlined, MenuUnfoldOutlined, SwapOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { IGadgetInfo } from './GadgetDetail'
import { IGlobalConfig } from '../interface'
import { dom2json } from '../utils'
import useGadget from '../hooks/useGadget'
import GadgetsList from './GadgetsList'
import InstallGadgetDialog from './InstallGadgetDialog'

/**
 * @author Jack Tony
 *
 * @date 2023/5/15
 */
export interface IProps {

  isCollapsed: boolean,

  globalConfig: IGlobalConfig

  gadgetInfo?: IGadgetInfo

  setGlobalLoading: (loading: boolean) => void

  onClickCollapse: () => void

  onGadgetChanged: (gadget: MicroApp) => void

  onReceiveActionHandleResult: (data: ActionHandleResultType) => void
}

export default (
  {
    globalConfig,
    isCollapsed,
    gadgetInfo,
    onClickCollapse,
    onGadgetChanged,
    onReceiveActionHandleResult,
  }: IProps) => {

  const [curGadgetInfo, setCurGadgetInfo] = useState<IGadgetInfo | undefined>(gadgetInfo)

  const [isDlgVisible, setIsDlgVisible] = useState<boolean>(false)

  const [localGadgetInfos, setLocalGadgetInfos] = useState<IGadgetInfo[]>([])

  const { loading, queryGadgets, gadgetInfos } = useGadget(
    globalConfig, curGadgetInfo, localGadgetInfos,
    onReceiveActionHandleResult, onGadgetChanged)

  useEffect(() => {
    const onPageWillBeClosed = (event: any) => {
      event.preventDefault()
      // TODO by kale: 2023/6/29 设置map前卸载当前gadget

      const historyRecords = dom2json('gadget-content')
      localStorage.setItem('haha', JSON.stringify(historyRecords))

      // gadget?.unmount()

      return (event.returnValue = 'Are you sure you want to exit?')
    }
    // window.addEventListener('beforeunload', onPageWillBeClosed)

    return () => {
      window.removeEventListener('beforeunload', onPageWillBeClosed)
    }
  }, [])


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
            setCurGadgetInfo({ name: 'DebugGadget', entryUrl: '//localhost:7031' } as IGadgetInfo)
          }}
        />
        <Typography.Text style={{ color: 'gray' }} ellipsis={true}>{'请在右侧选择你需要的道具 →'}</Typography.Text>
      </Space>
    }

    <InstallGadgetDialog
      visible={isDlgVisible}
      onSuccess={info => {
        localGadgetInfos.push(info)
        setLocalGadgetInfos([...localGadgetInfos])
        setCurGadgetInfo(info)
      }}
      onCancel={() => {
        setIsDlgVisible(false)
      }} />

    <Popover
      title={
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 4 }}>
          <span>四次元口袋</span>
          <div style={{ flex: 1 }} />
          <Button type={'link'} onClick={() => setIsDlgVisible(true)}>
            ✨ 安装新的道具
          </Button>
        </div>
      }
      trigger="click"
      placement="bottomRight"
      onOpenChange={(visible: boolean) => visible && queryGadgets()}
      content={<GadgetsList loading={loading} gadgetInfos={gadgetInfos} onItemSelect={info => setCurGadgetInfo(info)} />}
    >
      <Button style={{ margin: '0 12px' }} type={'primary'} icon={<SwapOutlined />}>
        切换道具
      </Button>
    </Popover>
  </div>
}

