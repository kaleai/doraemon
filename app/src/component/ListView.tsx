import React from 'react'
import { Button, Card, Divider, List, Space } from 'antd'
import { DownloadOutlined, MessageOutlined } from '@ant-design/icons'
import { SuggestActionType, ActionInfoType } from '../../../gadgets/template/Interface'

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
  SYS_CHAT_BOX = 'SYS_CHAT_BOX',
  SYS_MARKDOWN = 'SYS_MARKDOWN'
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
    renderItem={(itemData: ListItemDataType, index) => {
      switch (itemData.type) {
        case ItemType.FEEDBACK:
          return <Space style={{ display: 'flex', marginTop: -10, justifyContent: 'end' }} align={'end'}>
            <Button size={'small'} onClick={() => {
              console.log(itemData.conversationId)
              sendFeedback(true, itemData.conversationId)
            }
            }>
              👍
            </Button>
            <Button size={'small'} onClick={() => {
              console.log(itemData.conversationId)
              sendFeedback(false, itemData.conversationId)
            }
            }>
              👎
            </Button>
          </Space>
        case ItemType.SUGGESTION:
          return <Space wrap style={{ marginTop: 6 }}>{itemData.suggestActions?.map(suggest => {
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
        default:
          return (
            <List.Item
              style={{ paddingLeft: 12, paddingRight: 12, background: 'white' }}
            >
              <div key={itemData.id} id={itemData.id} />
            </List.Item>
          )
      }
    }} />
}
