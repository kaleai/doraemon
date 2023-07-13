import { Divider, message, Space, Spin } from 'antd'
import { dom2json, json2dom } from '../utils'
import ListView, { ListItemDataType } from './ListView'
import { ActionInfoType, FeedbackInfoType } from '../../gadget-template/Interface'
import { LoadingOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import { MicroAppStateActions } from 'qiankun'
import { ID } from '../constant'

interface IProps {

  loading: boolean

  listData: ListItemDataType[]

  history: Record<string, string> | undefined

  onClickSuggest: (actInfo: ActionInfoType) => void

  eventManager: MicroAppStateActions
}

export default ({ eventManager, loading, history, listData, onClickSuggest }: IProps) => {

  useEffect(() => {
    const elementById = document.getElementById(ID.HISTORY_RECORD)
    if (history && elementById) {
      elementById.appendChild(json2dom(history))
    }
  }, [history])

  return <>
    <div id={ID.GADGET_CONTENT} style={{ overflow: 'auto' }}>

      {/* history */}
      <div id={ID.HISTORY_RECORD} style={{ opacity: 0.7 }} />

      <div id={ID.HISTORY_DIVIDER_ID}>
        <Divider plain>以上为历史消息</Divider>
      </div>

      {/* main list */}
      <ListView
        dataSource={listData}
        onClickSuggestAction={onClickSuggest}
        onReceiveFeedback={(like, sessionUUId) => {
          message.success('感谢您的反馈，我会继续努力 💪🏻')

          eventManager.setGlobalState({
            category: 'FEEDBACK',
            params: {
              like,
              sessionUUId,
            } as FeedbackInfoType,
          })
        }}
      />

      {/* loading */}
      {loading &&
      <Space>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} />} />
        <div style={{ fontSize: 16 }}>{'正在思考中，请稍后...'}</div>
      </Space>}
    </div>
  </>
}
