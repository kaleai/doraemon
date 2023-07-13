import { Avatar, Button, List, Space } from 'antd'
import { DislikeTwoTone, LikeTwoTone, MessageOutlined } from '@ant-design/icons'
import { SuggestActionType, ActionInfoType, ISysChatBox, ISysErrorInfo, ISysMarkdown } from '../../gadget-template/Interface'
import ErrorPanel from './common/ErrorPanel'
import ChatBox from './common/ChatBox'
import MarkdownView from './common/MarkdownView'
import './index.css'
import { ItemType, ListItemDataType } from '../hooks/useListData'

/**
 * @author Jack Tony
 *
 * @date 2023/5/15
 */
export interface IProps {
  dataSource: ListItemDataType[]

  onClickSuggestAction: (actInfo: ActionInfoType) => void

  onReceiveFeedback: (like: boolean, sessionUUId?: string) => void
}

export default ({ dataSource, onClickSuggestAction, onReceiveFeedback: sendFeedback }: IProps) => {

  return <List
    itemLayout="vertical"
    dataSource={dataSource}
    split={false}
    rowKey={item => item.id}
    locale={{ emptyText: <></> }}
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
