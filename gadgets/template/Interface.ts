export type InstallParams = {
  onReceiveData: ((data: HandleResultDataType) => void) | undefined
  envInfo: Record<string, any>
}

export type ListItemInfo = {
  type: string // SYS_CHAT_BOX/SYS_MARKDOWN/...
  data: any
  expectation?: string
}

export interface IViewProps extends ListItemInfo {
  containerId: string
  readonly: boolean
}

export type ActionDataType = {
  action: string
  expectation?: string
  values?: any
}

export type SuggestActionType = { label: string, data: ActionDataType }

export type HandleResultDataType = {
  conversationId: string
  listItemInfos: ListItemInfo[]
  suggestActions?: SuggestActionType[]
}
