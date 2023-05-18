import React from 'react'
import { Button, Card, Divider, List } from 'antd'
import { DownloadOutlined, MessageOutlined } from '@ant-design/icons'

/**
 * @author Jack Tony
 *
 * @date 2023/5/15
 */
export type ListItemDataType = { id: string, type: ItemType, conversationId?: string, suggestActions?: { action: string, text: string }[] }

export enum ItemType {
  FEEDBACK= 'built-in-feedback',
  SUGGESTION = 'built-in-suggestion',
  DIVIDER = 'built-in-divider',
  GADGET = 'GADGET',
  SYS_CHAT_BOX = 'built-in-chat-box',
  SYS_MARKDOWN = 'built-in-markdown'
}

export interface IProps {
  dataSource: ListItemDataType[]
}

export default ({ dataSource }: IProps) => {
  return <List
    itemLayout="vertical"
    dataSource={dataSource}
    rowKey={item => item.id}
    renderItem={(item: ListItemDataType, index) => {
      switch (item.type) {
        case ItemType.DIVIDER:
          return <div style={{ height: 16 }} />
        case ItemType.SUGGESTION:
          return item.suggestActions?.map(act => {
            return <Button
              style={{ margin: 8 }}
              type={'dashed'} shape="round" icon={<MessageOutlined />} onClick={() => {
              console.log(act)
              // TODO by kale: 2023/5/18 给子应用发消息
            }
            }>
              {act.text}
            </Button>
          })
        case ItemType.FEEDBACK:
          return <Button onClick={() => {
            console.log(item.conversationId)
            // TODO by kale: 2023/5/18 给子应用发消息
          }
          }>
            like/unlike
          </Button>
      }
      return (
        <List.Item
          style={{ paddingLeft: 12, paddingRight: 12, background: 'white' }}
        >
          <div key={item.id} id={item.id} />
        </List.Item>
      )
    }} />
}
