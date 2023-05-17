import React from 'react'
import { Button, Card, Divider, List } from 'antd'
import { DownloadOutlined, MessageOutlined } from '@ant-design/icons'

/**
 * @author Jack Tony
 *
 * @date 2023/5/15
 */
export interface IProps {
  dataSource: { id: string, type?: string, suggestActions?: { action: string, text: string }[] }[]
}

export default ({ dataSource }: IProps) => {
  return <List
    id={'aladdin-chat-list'}
    itemLayout="vertical"
    dataSource={dataSource}
    rowKey={item => item.id}
    renderItem={(item, index) => {
      if (item.type === 'DIVIDER') {
        return <div style={{ height: 16 }} />
      } else if (item.type == 'SUGGEST') {
        return item.suggestActions?.map(act => {
          return <Button
            style={{margin:8}}
            type={'dashed'} shape="round" icon={<MessageOutlined />}>{act.text}</Button>
        })
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
