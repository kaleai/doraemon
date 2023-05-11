import { message } from 'antd'
import ReactDOM from 'react-dom'
import App, { handleAction } from './plugin'
import { MicroAppStateActions } from 'qiankun'
import { useEffect } from 'react'

const MessageView = (props: { text: string }) => {
  useEffect(() => {
    message.success(props.text + ' is installed 🎉')
  }, [])
  return <div />
}

const handleState = (state, setGlobalState) => {
  const { category, ...rest } = state

  if (category === 'ACTION') {
    const { action, expectation, values } = rest
    handleAction(action, expectation, values).then(res => {
      console.log('plugin js ', res)

      setGlobalState({
        category: 'DATA',
        suggestActions: res.suggestActions,
        listItemInfos: res.listItemInfos,
      })
    })
  }
}

export default {

  async bootstrap() {
    console.log('react app 111 bootstraped')
    return Promise.resolve()
  },

  /**
   * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
   */
  async mount(props: MicroAppStateActions & { container: any } & { name: string }) {
    props.onGlobalStateChange((state, prev) => {
      handleState(state, props.setGlobalState)
    })

    ReactDOM.render(<MessageView text={props.name} />, props.container.querySelector('#root'))
  },

  /**
   * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
   */
  async unmount(props) {
    ReactDOM.unmountComponentAtNode(
      props.container ? props.container.querySelector('#root') : document.getElementById('root'),
    )
    return Promise.resolve()
  },

  async update(props): Promise<any> {
    const { type, data, expectation, containerId, onReceiveAction: sendAction } = props
    ReactDOM.render(<App type={type} data={data} expectation={expectation} sendAction={sendAction} />, document.getElementById(containerId))

    return Promise.resolve()
  },

}
