import { Button, message } from 'antd'
import ReactDOM from 'react-dom'
import View from './View'
import { MicroAppStateActions } from 'qiankun'
import controller from './Controller'

let sendProcessedData

export default {

  bootstrap: async (props: any) => {
    sendProcessedData = props['onReceiveData']
    console.log('env', props)
    return Promise.resolve()
  },

  async unmount(props) {
    sendProcessedData = undefined
    ReactDOM.unmountComponentAtNode(
      props.container ? props.container.querySelector('#root') : document.getElementById('root'),
    )
  },

  mount: async (props: MicroAppStateActions & { container: any } & { name: string }) => {
    ReactDOM.render(<Button>ddd</Button>, props.container ? props.container.querySelector('#root') : document.getElementById('root'))
    message.success(props.name + ' is installed 🎉')

    setTimeout(() => {
      controller.handleAction({
        action: 'INITIALIZATION', expectation: 'init plugin view',
      }).then(res => sendProcessedData(res))
    }, 300)
  },

  update: async (props): Promise<any> => {
    const { containerId, type, data, expectation } = props
    ReactDOM.render(
      <View
        type={type}
        data={data}
        expectation={expectation}
        onSendAction={(params) => {
          controller.handleAction(params).then(res => sendProcessedData(res))
        }}
      />
      ,
      document.getElementById(containerId),
    )

    return Promise.resolve()
  },

}
