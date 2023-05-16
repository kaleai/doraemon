import { message } from 'antd'
import ReactDOM from 'react-dom'
import View from './View'
import controller from './Controller'
import { InstallParams, HandleResultDataType, IViewProps } from '../Interface'
import React from 'react'

let sendProcessedData: ((data: HandleResultDataType) => void) | undefined | null

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log('react app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  ReactDOM.render(<div />, props.container ? props.container.querySelector('#root') : document.getElementById('root'));
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {
  ReactDOM.unmountComponentAtNode(
    props.container ? props.container.querySelector('#root') : document.getElementById('root'),
  );
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {
  console.log('update props', props);
}

export default {

  bootstrap: async (props: InstallParams) => {
    sendProcessedData = props.onReceiveData
    return Promise.resolve()
  },

  async unmount(props: any) {
    sendProcessedData = undefined
    ReactDOM.unmountComponentAtNode(
      props.container ? props.container.querySelector('#root') : document.getElementById('root'),
    )
  },

  mount: async (props: { container: any, name: string }) => {
    ReactDOM.render(<div />, props.container ? props.container.querySelector('#root') : document.getElementById('root'))
    // message.success(`${props.name} is installed 🎉`)

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
