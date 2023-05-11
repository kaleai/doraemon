import { Button } from 'antd'
import { ActionListener, IHandleResult } from '../../../Interface'

export const handleAction = async (action: string, expectation: string, values?: any): Promise<IHandleResult> => {
  return {
    listItemInfos: [
      { role: 'user', type: 'button', data: { text: 'button text111' }, expectation: '点击按钮' },
    ],
  }
}

interface IProps {
  type: string,
  data: any,
  expectation: string
  sendAction: ActionListener
}

export default (props: IProps) => {

  return <Button type={'primary'}
                 onClick={() => {
                   props.sendAction('formButton','ddddd',{})
                 }}
  >{props.data.text}</Button>
}
