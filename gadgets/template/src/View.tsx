import { Button, Input } from 'antd'
import { IViewElementProps } from '../Interface'
import { ActionInfoType } from '../Interface'
import React, { useState } from 'react'

export default (
  {
    viewType,
    data,
    expectation,
    onSendAction: sendAction,
  }: IViewElementProps & { onSendAction: (actionInfo: ActionInfoType) => void },
) => {
  console.log(viewType, data, expectation)

  const [inputText, setInputText] = useState<string>()

  if (viewType === 'input') {
    return <div>
      <span>请在下方输入文本，点击按钮将会产出md5值</span>
      <Input.TextArea style={{ marginBottom: 8 }} defaultValue={data.text} onChange={event => {
        setInputText(event.currentTarget.value)
      }} />

      <Button type={'primary'} onClick={() => {
        sendAction({
          action: 'CALCULATE_MD5',
          values: { text: inputText ?? data.text },
        })
      }}>
        md5
      </Button>
    </div>
  } else if (viewType === 'text') {
    return <span>{data.text}</span>
  }

  return <div />
}
