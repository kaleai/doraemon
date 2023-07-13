import { Button, Input, message, Modal } from 'antd'
import GadgetDetail, { IGadgetInfo } from './GadgetDetail'
import { useState } from 'react'

/**
 * @author kale
 *
 * @date 2023/7/11
 */
interface IProps {
  visible: boolean

  onInstalled: (info: IGadgetInfo) => void

  onCancel: () => void
}

export default ({ visible, onInstalled, onCancel }: IProps) => {

  const [gadgetUrl, setGadgetUrl] = useState<string>()

  const [gadgetInfo, setGadgetInfo] = useState<IGadgetInfo>()

  return <Modal
    title="安装新的魔法道具"
    open={visible}
    zIndex={1060}
    footer={
      gadgetInfo ? <Button type={'primary'} onClick={() => onInstalled(gadgetInfo)}>安装</Button> : null
    }
    onCancel={onCancel}
  >
    <Input.Search
      style={{ marginBottom: 12 }}
      defaultValue={'http://localhost:7031'}
      placeholder={'请输入魔法道具的地址'}
      onSearch={url => setGadgetUrl(url)}
    />

    {gadgetUrl &&
    <GadgetDetail
      entryUrl={gadgetUrl}
      onLoadSuccess={(info) => setGadgetInfo(info)}
    />}
  </Modal>
}
