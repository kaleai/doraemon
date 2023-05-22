import React, { useEffect, useRef } from 'react'
import { Button, List, Space } from 'antd'
import { MessageOutlined } from '@ant-design/icons'
import { SuggestActionType, ActionInfoType, ISysChatBox, ISysErrorInfo } from '../../../gadgets/template/Interface'
import ErrorPanel from './ErrorPanel'
import ChatBox from './ChatBox'

/**
 * @author Jack Tony
 *
 * @date 2023/5/15
 */
export type ListItemDataType = {
  id: string, type: ItemType, data:
    { conversationId?: string, } |
    { suggestActions?: SuggestActionType[] } |
    ISysChatBox |
    ISysErrorInfo;
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

  onReceiveFeedback: (like: boolean, conversationId?: string) => void
}

export default ({ dataSource, onClickSuggestAction, onReceiveFeedback: sendFeedback }: IProps) => {

  const ref = useRef(null);

  const handleResize = () => {
    window.requestIdleCallback(() => {
      // 在浏览器空闲时更新样式
      if (ref.current) {
      }
    });
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    if (ref.current) {
      // @ts-ignore
      resizeObserver.observe(ref.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return <List
    itemLayout="vertical"
    dataSource={dataSource}
    split={false}
    rowKey={item => {
      console.log('itemId',item.id)
      return item.id
    }}
    locale={{ emptyText: <div>Empty</div> }}
    renderItem={(item: ListItemDataType, index) => {
      // @ts-ignore
      const { conversationId, suggestActions, placeholder, errorInfo } = item.data

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
