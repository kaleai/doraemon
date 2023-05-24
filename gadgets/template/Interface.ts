/**
 * @author Jack Tony
 * @date 2023/5/20
 */
export enum SYS_ACTION_NAME {
  INITIALIZATION = 'SYS_INITIALIZATION',
  CHAT_BOX_SUBMIT = 'SYS_CHAT_BOX_SUBMIT'
}

export type InstallParams = {
  onReceiveConversationData: ((data: ConversationDataType) => void) | undefined
  envInfo: Record<string, any>
}

export type ViewElementInfoType = {
  viewType: string // view类型。如：SYS_CHAT_BOX/SYS_MARKDOWN/...
  data: any // view渲染所需的数据
  expectation?: string // 期望用户做的事情
}

export interface IViewElementProps extends ViewElementInfoType {
  containerId: string // view容器的id
  isReadonly: boolean // view是否是只读状态
}

export type ActionInfoType = {
  action: string
  expectation?: string
  values?: any
}

export type SuggestActionType = { label: string, actionInfo: ActionInfoType }

export type ConversationDataType = {
  conversationId: string
  viewElementInfos: ViewElementInfoType[]
  suggestActions?: SuggestActionType[]
}

export interface ISysErrorInfo {
  name: string
  message?: string
  code?: string
}

export interface ISysChatBox {
  placeholder?: string
}

abstract class AbsViewEleInfo<T> implements ViewElementInfoType {
  viewType: string
  data: T
  expectation?: string

  protected constructor(viewType: string, info: T, expectation?: string) {
    this.viewType = viewType
    this.data = info
    this.expectation = expectation
  }
}

export class SysViewElementInfo {

  static ErrorPanel = class cls extends AbsViewEleInfo<ISysErrorInfo> {
    constructor(info: ISysErrorInfo, expectation?: string) {
      super('SYS_ERROR', info, expectation)
    }
  }

  static ChatBox = class cls extends AbsViewEleInfo<ISysChatBox> {
    constructor(info: ISysChatBox, expectation?: string) {
      super('SYS_CHAT_BOX', info, expectation)
    }
  }

}
