import { Tabs, Modal } from 'antd'
import { Confetti } from 'confetti-ts-canvas'

/**
 * @author Jack Tony
 *
 * @date 2023/6/21
 */
export const showDonateDialog = (onClose: () => void) => {
  Modal.success({
    title: '向作者投币，买个饭团吧 🍙',
    width: window.innerWidth * 0.8,
    okText: '感谢您的支持 🎉',
    onOk: () => {
      const canvas = window.document.getElementById('fireworks_canvas')
      if (canvas) {
        // @ts-ignore
        canvas.width = window.innerWidth
        // @ts-ignore
        canvas.height = window.innerHeight
        // @ts-ignore
        const ctx = canvas.getContext('2d')

        new Confetti({
          // @ts-ignore
          paint: ctx, canvasWidth: canvas.width, canvasHeight: canvas.height,
        }).run()

        setTimeout(() => {
          onClose()
        }, 6000)
      }
    },
    content:
      <div>
        <span>如需录入项目鸣谢，捐赠后送金额和姓名到 kaleai@qq.com ，十分感谢！</span>
        <Tabs defaultActiveKey="wechat" items={[
          {
            key: 'wechat',
            label: '微信',
            children: <img style={{ maxWidth: 380, width: '80%' }} src="/wechat.jpg" alt="wechat" />,
          },
          {
            key: 'alipay',
            label: '支付宝',
            children: <img style={{ maxWidth: 380, width: '80%' }} src="/alipay.jpg" alt="alipay" />,
          },
        ]} />
      </div>,
  })
}
