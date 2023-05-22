import React from 'react'
import { Button, List, Space } from 'antd'
import { MessageOutlined } from '@ant-design/icons'
import { SuggestActionType, ActionInfoType, ISysChatBox, ISysErrorInfo } from '../../../gadgets/template/Interface'
import ErrorPanel from './ErrorPanel'

/**
 * @author Jack Tony
 *
 * @date 2023/5/15
 */
export type ListItemDataType = {
  id: string, type: ItemType, data:
    { conversationId?: string, } |
    { suggestActions?: SuggestActionType[] } |
    { chatBoxInfo: ISysChatBox } |
    { errorInfo: ISysErrorInfo };
}

export enum ItemType {
  GADGET = 'GADGET',
  FEEDBACK = 'SYS_FEEDBACK',
  SUGGESTION = 'SYS_SUGGESTION',
  DIVIDER = 'SYS_DIVIDER',
  CHAT_BOX = 'SYS_CHAT_BOX',
  MARKDOWN = 'SYS_MARKDOWN',
  ERROR = 'SYS_ERROR'
}

export interface IProps {
  dataSource: ListItemDataType[]

  onClickSuggestAction: (data: ActionInfoType) => void

  onReceiveFeedback: (like: boolean, conversationId?: string) => void
}

export default ({ dataSource, onClickSuggestAction, onReceiveFeedback: sendFeedback }: IProps) => {
  return <List
    itemLayout="vertical"
    dataSource={dataSource}
    split={false}
    rowKey={item => item.id}
    locale={{ emptyText: <div>Empty</div> }}
    renderItem={(item: ListItemDataType, index) => {
      // @ts-ignore
      const { conversationId, suggestActions, chatBoxInfo, errorInfo } = item.data

      switch (item.type) {
        case ItemType.FEEDBACK:
          return <Space style={{ display: 'flex', marginTop: -10, justifyContent: 'end' }} align={'end'}>
            <Button size={'small'} onClick={() => {
              console.log(conversationId)
              sendFeedback(true, conversationId)
            }
            }>
              👍
            </Button>
            <Button size={'small'} onClick={() => {
              console.log(conversationId)
              sendFeedback(false, conversationId)
            }
            }>
              👎
            </Button>
          </Space>
        case ItemType.SUGGESTION:
          return <Space wrap style={{ marginTop: 6 }}>{suggestActions?.map((suggest: SuggestActionType) => {
            return <Button
              type={'dashed'} shape="round" icon={<MessageOutlined />} onClick={() => {
              onClickSuggestAction(suggest.actionInfo)
            }
            }>
              {suggest.label}
            </Button>
          })}</Space>
        case ItemType.DIVIDER:
          return <div style={{ height: 16 }} />
        case ItemType.ERROR:
          return <ErrorPanel name={errorInfo.name} message={errorInfo.message} code={errorInfo.code} />
        default:
          return (
            <List.Item
              style={{ paddingLeft: 12, paddingRight: 12, background: 'white' }}
            >
              <div key={item.id} id={item.id} />
            </List.Item>
          )
      }
    }} />
}
