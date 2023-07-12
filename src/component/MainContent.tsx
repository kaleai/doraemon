import { Divider, message, Space, Spin } from 'antd'
import { dom2json, json2dom } from '../utils'
import ListView, { ListItemDataType } from './ListView'
import { ActionInfoType, FeedbackInfoType } from '../../gadget-template/Interface'
import { LoadingOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import { initGlobalState, MicroAppStateActions } from 'qiankun'
import { ID } from '../constant'

interface IProps {

  loading: boolean

  listData: ListItemDataType[]

  history: Record<string, string> | undefined

  onClickSuggest: (actInfo: ActionInfoType) => void
}

export default ({ loading, history, listData, onClickSuggest }: IProps) => {

  const eventManager: MicroAppStateActions = initGlobalState({})

  useEffect(() => {
    const elementById = document.getElementById('history-record')
    if (history && elementById) {
      elementById.appendChild(json2dom(history))
    }
  }, [history])

  return <>
    <div id={ID.GADGET_CONTENT}>

      {/* history */}
      <div id={'history-record'}>
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
  </>
}
