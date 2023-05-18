import { ActionDataType, HandleResultDataType } from '../Interface'
import axios from 'axios'

const md5 = require('js-md5')
/**
 * @author Jack Tony (jinkai.jk@alibaba-inc.com)
 *
 * @date 2023/5/12
 */
class Controller {

  public async handleAction({ action, expectation, values }: ActionDataType): Promise<HandleResultDataType> {
    console.log('handle action:', action, values)

    if (action === 'INITIALIZATION') {
      return {
        conversationId: 'eg:' + Math.random(),
        listItemInfos: [{ type: 'input', data: { text: 'please input some text' }, expectation: 'INPUT_STRING' }],
      }
    } else if (action === 'CALCULATE_MD5') {
      axios({
        method: 'get',
        url: 'http://kale.com/fake/api',
        responseType: 'stream',
      }).catch(err => {
        console.error(err)
      })
      const md5Str = md5(values.text)
      return {
        conversationId: 'eg:' + Math.random(),
        listItemInfos: [
          { type: 'text', data: { text: md5Str } },
          { type: 'input', data: { text: 'please input some text' }, expectation: 'INPUT_STRING' },
        ],
        suggestActions: [
          { label: '建议信息01', data: { action: 'dddd' } },
          { label: '建议信息02', data: { action: 'dddd' } },
          { label: '建议信息03', data: { action: 'dddd' } },
          { label: 'action name 03', data: { action: 'dddd' } },
          { label: 'action name 03', data: { action: 'dddd' } },
          { label: 'action name 03', data: { action: 'dddd' } },
          { label: 'action name 03', data: { action: 'dddd' } },
        ],
      }
    } else {
      return { conversationId: 'eg:' + Math.random(), listItemInfos: [] }
    }
  }
}

export default new Controller()
