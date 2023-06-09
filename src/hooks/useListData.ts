import { useEffect, useState } from 'react'
import { MicroAppStateActions } from 'qiankun'
import {
  ActionHandleResultType,
  ActionInfoType, ISysChatBox, ISysErrorInfo, ISysMarkdown,
  IViewElementProps,
  SuggestActionType,
  ViewElementInfoType,
} from '../../gadget-template/Interface'
import md5 from 'js-md5'
import { MicroApp } from 'qiankun/lib'

/**
 * @author kale
 *
 * @date 2023/7/11
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

export default (eventManager: MicroAppStateActions, microApp?: MicroApp, conversationId?: string) => {

  const [listData, setListData] = useState<ListItemDataType[]>([])

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (microApp) {
      setTimeout(() => {
        sendActionToGadget({
          action: 'SYS_INITIALIZATION',
          expectation: 'init gadget',
        })
      }, 200)
    }
  }, [microApp])

  useEffect(()=>{
    setListData([])
  },[conversationId])

  /**
   * 给gadget发送action，让gadget进行处理
   */
  const sendActionToGadget = (actionInfo: ActionInfoType) => {
    setLoading(true)

    eventManager.setGlobalState({
      category: 'ACTION',
      params: actionInfo,
    })
  }

  /**
   * 得到gadget处理action后的结果
   */
  const onReceiveHandleResult = (res: ActionHandleResultType) => {
    setLoading(false)

    const viewPropsList: IViewElementProps[] = []
    const eleInfoList = res.viewElementInfos
    const sessionId = md5(res.sessionUUId)

    eleInfoList.forEach((itemInfo: ViewElementInfoType, index) => {
      const viewType = itemInfo.viewType.startsWith('SYS') ? itemInfo.viewType as ItemType : ItemType.GADGET
      const containerId = sessionId + '_' + index

      listData.push({
        id: containerId,
        type: viewType,
        data: itemInfo.data,
      })

      if (viewType === ItemType.GADGET) {
        viewPropsList.push({
          containerId,
          isReadonly: index < eleInfoList.length - 1,
          onSendAction: sendActionToGadget,
          ...itemInfo,
        })
      }
    })

    // add feedback
    if (res.canFeedback !== false) {
      listData.push({ id: sessionId + '_feedback', type: ItemType.FEEDBACK, data: { sessionUUId: res.sessionUUId } })
    }

    // add suggest
    if (res.suggestActions) {
      listData.push({ id: sessionId + '_suggestion', type: ItemType.SUGGESTION, data: { suggestActions: res.suggestActions } })
    }

    // add divider
    listData.push({ id: sessionId + '_divider', type: ItemType.DIVIDER, data: {} })

    setListData([...listData])

    // bind view to list item
    viewPropsList.forEach(props => setTimeout(() => microApp?.update?.(props), 50))
  }

  return {
    listData,
    loading,
    sendActionToGadget,
    onReceiveHandleResult,
  }
}
