import { Button, Divider, message, Space, Spin } from 'antd'
import { dom2json } from '../utils'
import ListView from './ListView'
import { ActionHandleResultType, FeedbackInfoType } from '../../gadget-template/Interface'
import { LoadingOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import { MicroApp } from 'qiankun/es/interfaces'
import useListData from '../hooks/useListData'
import { initGlobalState, MicroAppStateActions } from 'qiankun'

interface IProps {

  domJson?: Record<string, string>

  isGlobalLoading: boolean

  curGadgetRef: MicroApp | undefined
}

export default ({ domJson, curGadgetRef, isGlobalLoading }: IProps) => {

  const eventManager: MicroAppStateActions = initGlobalState({})

  const { listData, sendActionToGadget, isGadgetLoading } = useListData(eventManager, curGadgetRef)

  return <>
    <Button type={'primary'} onClick={() => {
      const res = dom2json('gadget-content')
      console.log('json', res)

      // const dom = json2dom(res)
      // document.getElementById('history-record')?.appendChild(dom)
    }}>click</Button>
    <Spin spinning={isGlobalLoading}>
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
            onClickSuggestAction={actInfo => sendActionToGadget(actInfo)}
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
          {isGadgetLoading &&
          <Space>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} />} />
            <div style={{ fontSize: 16 }}>{'正在思考中，请稍后...'}</div>
          </Space>}
        </div>
      </div>
    </Spin>
  </>
}
