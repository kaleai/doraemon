export interface IListItemInfo {
  role: 'user' | 'assistant'
  type: string
  data: any
  expectation: string
}

export interface IHandleResult {
  listItemInfos: IListItemInfo[],
  suggestActions?: { action: string, text: string }
}

export type ActionListener = (action: string, expectation: string, values?: any) => void

export interface IPlugin {

  setActionListener(listener: ActionListener)

  /**
   * 处理事件
   *
   * @param action 默认是init
   * @param expectation 期望用户做的事情。结合用户提交的信息做校验
   * @param values 用户提交的信息
   */
  handleAction: (action: string, expectation: string, values?: any) => Promise<IHandleResult>

  /**
   * 渲染listItem的view
   *
   * @param type 类型
   * @param data 当前item的数据
   * @param expectation 期望用户做的事情
   */
  renderListItem: (type: string, data: any, expectation: string) => any

}
