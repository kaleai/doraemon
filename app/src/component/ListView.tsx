import React from 'react'
import { Button, Card, Divider, List, Space } from 'antd'
import { DownloadOutlined, MessageOutlined } from '@ant-design/icons'
import { SuggestActionType, ActionDataType } from '../../../gadgets/template/Interface'

/**
 * @author Jack Tony
 *
 * @date 2023/5/15
 */
export type ListItemDataType = { id: string, type: ItemType, conversationId?: string, suggestActions?: SuggestActionType[] }

export enum ItemType {
  FEEDBACK = 'built-in-feedback',
  SUGGESTION = 'built-in-suggestion',
  DIVIDER = 'built-in-divider',
  GADGET = 'GADGET',
  SYS_CHAT_BOX = 'built-in-chat-box',
  SYS_MARKDOWN = 'built-in-markdown'
}

export interface IProps {
  dataSource: ListItemDataType[]

  onClickSuggestAction: (data: ActionDataType) => void

  onReceiveFeedback: (like: boolean, conversationId?: string) => void
}

export default ({ dataSource, onClickSuggestAction, onReceiveFeedback: sendFeedback }: IProps) => {
  return <List
    itemLayout="vertical"
    dataSource={dataSource}
    split={false}
    rowKey={item => item.id}
    locale={{emptyText:<div>Empty</div>}}
    renderItem={(item: ListItemDataType, index) => {
      switch (item.type) {
        case ItemType.FEEDBACK:
          return <Space style={{ display: 'flex', marginTop: -10, justifyContent: 'end' }} align={'end'}>
            <Button size={'small'} onClick={() => {
              console.log(item.conversationId)
              sendFeedback(true, item.conversationId)
            }
            }>
              👍
            </Button>
            <Button size={'small'} onClick={() => {
              console.log(item.conversationId)
              sendFeedback(false, item.conversationId)
            }
            }>
              👎
            </Button>
          </Space>
        case ItemType.SUGGESTION:
          return <Space wrap style={{ marginTop: 6 }}>{item.suggestActions?.map(info => {
            return <Button
              type={'dashed'} shape="round" icon={<MessageOutlined />} onClick={() => {
              onClickSuggestAction(info.data)
            }
            }>
              {info.label}
            </Button>
          })}</Space>
        case ItemType.DIVIDER:
          return <div style={{ height: 16 }} />
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
