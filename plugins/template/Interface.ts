export type IListItemInfo = {
  role: 'user' | 'assistant'
  type: string
  data: any
  expectation: string
}

export interface IViewProps extends IListItemInfo {
  containerId: string
}

export type HandleResultDataType = {
  listItemInfos: IListItemInfo[]
  suggestActions?: { action: string, text: string }
}
