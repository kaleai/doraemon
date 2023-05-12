import { HandleResultDataType } from '../Interface'

/**
 * @author Jack Tony (jinkai.jk@alibaba-inc.com)
 *
 * @date 2023/5/12
 */
export type ActionParamsType = {
  action: string
  expectation: string
  values?: any
}

class Controller {

  public async handleAction({ action, expectation, values }: ActionParamsType): Promise<HandleResultDataType> {
    if (action === 'INITIALIZATION') {
      return {
        listItemInfos: [
          { role: 'user', type: 'select', data: { text: 'select view' }, expectation: 'select' },
        ],
      }
    } else if (action === 'button') {
      return {
        listItemInfos: [
          { role: 'user', type: 'button', data: { text: 'button text111' }, expectation: 'button' },
        ],
      }
    } else {
      return {
        listItemInfos: [
          { role: 'assistant', type: 'tag', data: { text: 'tag text' }, expectation: 'tag' },
        ],
      }

    }
  }
}

export default new Controller()
