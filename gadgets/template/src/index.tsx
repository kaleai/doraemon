import { message } from 'antd'
import ReactDOM from 'react-dom'
import View from './View'
import controller from './Controller'
import { InstallParams, HandleResultDataType, IViewProps } from '../Interface'
import React from 'react'

let sendProcessedData: ((data: HandleResultDataType) => void) | undefined | null

export default {

  bootstrap: async (props: InstallParams) => {
    sendProcessedData = props.onReceiveData
    return Promise.resolve()
  },

  unmount: async (props: any) => {
    sendProcessedData = undefined
    ReactDOM.unmountComponentAtNode(
      props.container ? props.container.querySelector('#root') : document.getElementById('root'),
    )
  },

  mount: async (props: { container: any, name: string }) => {
    ReactDOM.render(<div />, props.container ? props.container.querySelector('#root') : document.getElementById('root'))
    message.success(`${props.name} is installed 🎉`)

    setTimeout(() => {
      controller.handleAction({
        action: 'INITIALIZATION', expectation: 'init plugin view',
      }).then(res => sendProcessedData?.(res))
    }, 300)
  },

  update: async (props: IViewProps): Promise<any> => {
    const { readonly, containerId, type, data, expectation } = props
    ReactDOM.render(
      <View
        containerId={containerId}
        readonly={readonly}
        type={type}
        data={data}
        expectation={expectation}
        onSendAction={(params) => {
          params.expectation = expectation
          controller.handleAction(params).then(res => sendProcessedData?.(res))
        }}
      />
      ,
      document.getElementById(containerId),
    )

    return Promise.resolve()
  },

}
