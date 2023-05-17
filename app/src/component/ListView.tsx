import React from 'react'
import { Card, Divider, List } from 'antd'

/**
 * @author Jack Tony
 *
 * @date 2023/5/15
 */
export interface IProps {
  dataSource: { id: string, type?: string }[]
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
