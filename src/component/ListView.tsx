import React, { useEffect, useRef } from 'react'
import { Avatar, Button, List, Space } from 'antd'
import { DislikeTwoTone, LikeTwoTone, MessageOutlined } from '@ant-design/icons'
import { SuggestActionType, ActionInfoType, ISysChatBox, ISysErrorInfo, ISysMarkdown } from '../../gadget-template/Interface'
import ErrorPanel from './common/ErrorPanel'
import ChatBox from './common/ChatBox'
import MarkdownView from './common/MarkdownView'
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
    itemLayout="vertical"
    dataSource={dataSource}
    split={false}
    rowKey={item => item.id}
    locale={{
      emptyText:
        <Space id={'empty-area-id'} className={'fullHeight'} style={{ marginTop: 100 }} direction={'vertical'} size={'large'}>
          <Avatar size={100} src={'https://cdn-icons-png.flaticon.com/512/7486/7486754.png'} shape={'square'} />
          <span style={{ color: 'gray', fontWeight: 'bold' }}>空空如也~ 您可以在右上角切换你需要的功能</span>
        </Space>
      ,
    }}
    renderItem={(item: ListItemDataType, index) => {
      // @ts-ignore
      const { sessionUUId, suggestActions, placeholder, errorInfo, content } = item.data

      switch (item.type) {
        case ItemType.FEEDBACK:
          return <Space style={{ display: 'flex', marginTop: -10, marginRight: 4, justifyContent: 'end' }} align={'end'}>
            <Button
              size={'small'}
              icon={<LikeTwoTone twoToneColor={'#f9b843'} />}
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
              key={suggest.actionInfo.action}
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
