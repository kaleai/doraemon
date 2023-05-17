export type InstallParams = {
  onReceiveData: ((data: HandleResultDataType) => void) | undefined
  envInfo: Record<string, any>
}

export type ListItemInfo = {
  type: string
  data: any
  expectation?: string
}

export interface IViewProps extends ListItemInfo {
  containerId: string
  readonly: boolean
}

export type HandleResultDataType = {
  listItemInfos: ListItemInfo[]
  suggestActions?: { action: string, text: string }[]
}
