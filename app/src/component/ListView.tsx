import React, { useEffect, useRef } from 'react'
import { Avatar, Button, List, Space } from 'antd'
import { DislikeOutlined, DislikeTwoTone, LikeFilled, LikeOutlined, LikeTwoTone, MessageOutlined } from '@ant-design/icons'
import { SuggestActionType, ActionInfoType, ISysChatBox, ISysErrorInfo, ISysMarkdown } from '../../../gadgets/template/Interface'
import ErrorPanel from './ErrorPanel'
import ChatBox from './ChatBox'
import EmptyImg from '../image/empty.png'
import MarkdownView from './MarkdownView'
import './index.css'

/**
 * @author Jack Tony
 *
 * @date 2023/5/15
 */
export type ListItemDataType = {
  id: string, type: ItemType, data: { sessionUUId?: string, } |
    { suggestActions?: SuggestActionType[] } |
    ISysChatBox |
    ISysErrorInfo |
    ISysMarkdown
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

  onClickSuggestAction: (actInfo: ActionInfoType) => void

  onReceiveFeedback: (like: boolean, sessionUUId?: string) => void
}

export default ({ dataSource, onClickSuggestAction, onReceiveFeedback: sendFeedback }: IProps) => {

  const ref = useRef(null)

  const handleResize = () => {
    window.requestIdleCallback(() => {
      // 在浏览器空闲时更新样式
      if (ref.current) {
      }
    })
  }

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize)
    if (ref.current) {
      // @ts-ignore
      resizeObserver.observe(ref.current)
    }
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return <List
    className={'fullHeight'}
    itemLayout="vertical"
    dataSource={dataSource}
    split={false}
    rowKey={item => {
      console.log('itemId', item.id)
      return item.id
    }}
    locale={{
      emptyText: <Space style={{ marginTop: 100 }} direction={'vertical'} size={'large'}>
        <Avatar size={100} src={EmptyImg} />
        Empty! Please select the item you need in the top right corner </Space>,
    }}
    renderItem={(item: ListItemDataType, index) => {
      // @ts-ignore
      const { sessionUUId, suggestActions, placeholder, errorInfo, content } = item.data

      switch (item.type) {
        case ItemType.FEEDBACK:
          return <Space style={{ display: 'flex', marginTop: -10,marginRight:4, justifyContent: 'end' }} align={'end'}>
            <Button
              size={'small'}
              icon={<LikeTwoTone twoToneColor={'#f9be55'}/>}
              onClick={() => {
                sendFeedback(true, sessionUUId)
              }} />
            <Button
              size={'small'}
              icon={<DislikeTwoTone />}
              onClick={() => {
                sendFeedback(false, sessionUUId)
              }
              } />
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
        case ItemType.MARKDOWN:
          return <MarkdownView content={content} />
        case ItemType.ERROR:
          return <ErrorPanel name={errorInfo.name} message={errorInfo.message} code={errorInfo.code} />
        case ItemType.CHAT_BOX:
          return <ChatBox placeholder={placeholder} onSubmit={(actInfo) => {
            onClickSuggestAction(actInfo)
          }} />
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
