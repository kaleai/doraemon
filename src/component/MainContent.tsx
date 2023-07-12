import { Divider, message, Space, Spin } from 'antd'
import { dom2json, json2dom } from '../utils'
import ListView, { ListItemDataType } from './ListView'
import { ActionInfoType, FeedbackInfoType } from '../../gadget-template/Interface'
import { LoadingOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import { initGlobalState, MicroAppStateActions } from 'qiankun'

interface IProps {

  loading: boolean

  listData: ListItemDataType[]

  historyRecord: Record<string, string> | undefined

  onClickSuggestAction: (actInfo: ActionInfoType) => void
}

export default ({ loading, historyRecord, listData, onClickSuggestAction }: IProps) => {

  const eventManager: MicroAppStateActions = initGlobalState({})

  useEffect(() => {
    const elementById = document.getElementById('history-record')
    if (historyRecord && elementById) {
      elementById.appendChild(json2dom(historyRecord))
    }
  }, [historyRecord])

  return <>
    <div
      style={{
        height: window.innerHeight - 60,
        overflow: 'auto',
        padding: 12,
      }}
    >
      <div id={'gadget-content'}>

        {/* history */}
        <div id={'history-record'}>
          <Divider plain>以上为历史消息</Divider>
        </div>

        {/* main list */}
        <ListView
          dataSource={listData}
          onClickSuggestAction={onClickSuggestAction}
          onReceiveFeedback={(like, sessionUUId) => {
            message.success('感谢您的反馈，我会继续努力 💪🏻')

            eventManager.setGlobalState({
              category: 'FEEDBACK',
              params: {
                like,
                sessionUUId,
              } as FeedbackInfoType,
            })
          }
          }
        />

        {/* loading */}
        {loading &&
        <Space>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} />} />
          <div style={{ fontSize: 16 }}>{'正在思考中，请稍后...'}</div>
        </Space>}
      </div>
    </div>
  </>
}
