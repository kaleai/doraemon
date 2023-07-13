import { Avatar, Divider, message, Space, Spin } from 'antd'
import { json2dom } from '../utils'
import ListView from './ListView'
import { ActionInfoType, FeedbackInfoType } from '../../gadget-template/Interface'
import { LoadingOutlined } from '@ant-design/icons'
import React, { useEffect } from 'react'
import { MicroAppStateActions } from 'qiankun'
import { ID } from '../constant'
import { ListItemDataType } from '../hooks/useListData'

interface IProps {
  loading: boolean
  listData: ListItemDataType[]
  onClickSuggest: (actInfo: ActionInfoType) => void
  eventManager: MicroAppStateActions
}

export default ({ eventManager, loading, listData, onClickSuggest }: IProps) => {

  return <>
    <div style={{ overflow: 'auto' }}>
      <div id={ID.GADGET_CONTENT}>

        {/* history container */}
        <div id={ID.HISTORY_RECORD} />

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
      </div>

      {/* empty area */}
      {listData.length === 0 &&
        <Space
          className={'fullWidth'} style={{ marginTop: 100 }}
          direction={'vertical'} size={'large'} align={'center'}
        >
          <Avatar size={100} src={'https://cdn-icons-png.flaticon.com/512/7486/7486754.png'} shape={'square'} />
          <span style={{ color: 'gray', fontWeight: 'bold' }}>空空如也~ 您可以在右上角切换你需要的道具</span>
        </Space>}

      {/* loading */}
      {loading &&
        <Space>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 18 }} />} />
          <div style={{ fontSize: 16 }}>{'正在思考中，请稍后...'}</div>
        </Space>}
    </div>
  </>
}
