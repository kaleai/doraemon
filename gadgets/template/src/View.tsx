import { Button, Input, Tag } from 'antd'
import { IViewProps } from '../Interface'
import { ActionDataType } from './Controller'
import React, { useEffect, useRef, useState } from 'react'

export default (
  {
    type,
    data,
    expectation,
    onSendAction: sendAction,
  }: IViewProps & { onSendAction: (params: ActionParamsType) => void },
) => {
  console.log(type, data, expectation)

  const [inputText, setInputText] = useState<string>()


  if (type === 'input') {
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
  } else if (type === 'text') {
    return <span>{data.text}</span>
  }

  return <div />
}
