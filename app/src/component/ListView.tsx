import React from 'react'
import { Card, List } from 'antd'

/**
 * @author Jack Tony
 *
 * @date 2023/5/15
 */
export interface IProps {
  dataSource: { id: string }[]
}

export default ({ dataSource }: IProps) => {
  return <List
    id={'aladdin-chat-list'}
    itemLayout="vertical"
    dataSource={dataSource}
    renderItem={(item, index) => (
      <List.Item
        style={{ paddingLeft: 12, paddingRight: 12 }}
      >
        <Card>
          <div key={item.id} id={item.id} />
        </Card>
      </List.Item>

    )} />
}
