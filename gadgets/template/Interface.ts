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

export class SysViewElementInfo {

  static ErrorInfo = class cls implements ViewElementInfoType {
    viewType: 'SYS_ERROR'
    data: any
    expectation?: string

    constructor(info: ISysErrorInfo, expectation?: string) {
      this.data = info
      this.expectation = expectation
    }
  }

  static MarkdownInfo = class cls implements ViewElementInfoType {
    viewType: 'SYS_CHAT_BOX'
    data: any
    expectation?: string

    constructor(info: ISysChatBox, expectation?: string) {
      this.data = info
      this.expectation = expectation
    }
  }

}
