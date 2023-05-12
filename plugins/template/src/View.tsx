import { Button, Select, Tag } from 'antd'
import { IViewProps } from '../Interface'
import { ActionParamsType } from './Controller'

export default (
  {
    type,
    data,
    expectation,
    onSendAction: sendAction,
  }: IViewProps & { onSendAction: (params: ActionParamsType) => void },
) => {
  console.log(type, data, expectation)

  if (type === 'button') {
    return <Button
      type={'primary'}
      onClick={() => {
        sendAction({
          action: 'tag',
          values: 'name',
          expectation: 'exp',
        })
      }}
    >{data.text}</Button>
  } else if (type === 'select') {
    return <Select
      defaultValue={data.text}
      style={{ width: 120 }}
      onChange={(value) => {
        console.log('change ', value)
        sendAction({
          action: 'button',
          values: 'name',
          expectation: 'exp',
        })
      }}
      options={[
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'Yiminghe', label: 'yiminghe' },
        { value: 'disabled', label: 'Disabled', disabled: true },
      ]}
    />
  }

  return <Tag color="magenta">{data.text}</Tag>
}
