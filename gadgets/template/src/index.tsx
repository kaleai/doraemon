import { message } from 'antd'
import ReactDOM from 'react-dom'
import View from './View'
import controller from './Controller'
import { InstallParams, ConversationDataType, IViewElementProps } from '../Interface'
import React from 'react'

let onReceiveHandleResult: ((data: ConversationDataType) => void) | undefined | null

export default {

  bootstrap: async (props: InstallParams) => {
    onReceiveHandleResult = props.onReceiveConversationData
    return Promise.resolve()
  },

  unmount: async (props: any) => {
    onReceiveHandleResult = undefined
    ReactDOM.unmountComponentAtNode(
      props.container ? props.container.querySelector('#root') : document.getElementById('root'),
    )
  },

  mount: async (props: { container: any, name: string, onGlobalStateChange: (params: any) => void }) => {
    props.onGlobalStateChange((state: any, prev: any) => { // state: 变更后的状态; prev 变更前的状态
      if (state.type === 'ACTION') {
        controller.handleAction(state.params)
      } else if (state.type === 'FEEDBACK') {
        console.log(state.params)
      }
    })

    ReactDOM.render(<div />, props.container ? props.container.querySelector('#root') : document.getElementById('root'))
    // message.success(`${props.name} is installed 🎉`)

    setTimeout(() => {
      controller.handleAction({
        action: 'INITIALIZATION', expectation: 'init plugin view',
      }).then(res => onReceiveHandleResult?.(res))
    }, 300)
  },

  update: async (props: IViewElementProps): Promise<any> => {
    const { isReadonly, containerId, viewType, data, expectation } = props
    ReactDOM.render(
      <View
        containerId={containerId}
        isReadonly={isReadonly}
        viewType={viewType}
        data={data}
        expectation={expectation}
        onSendAction={(actionInfo) => {
          actionInfo.expectation = expectation
          controller.handleAction(actionInfo).then(res => onReceiveHandleResult?.(res))
        }}
      />
      ,
      document.getElementById(containerId),
    )

    return Promise.resolve()
  },

}
