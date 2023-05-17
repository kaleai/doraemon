import { HandleResultDataType } from '../Interface'
import axios from 'axios'

const md5 = require('js-md5')
/**
 * @author Jack Tony (jinkai.jk@alibaba-inc.com)
 *
 * @date 2023/5/12
 */
export type ActionParamsType = {
  action: string
  expectation?: string
  values?: any
}

class Controller {

  public async handleAction({ action, expectation, values }: ActionParamsType): Promise<HandleResultDataType> {
    console.log('handle action:', action, values)

    if (action === 'INITIALIZATION') {
      return {
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
        listItemInfos: [
          { type: 'text', data: { text: md5Str } },
          { type: 'input', data: { text: 'please input some text' }, expectation: 'INPUT_STRING' },
        ],
        suggestActions:[
          {action:'dddd',text:'建议信息01'},
          {action:'dddd',text:'建议信息02'},
          {action:'dddd',text:'建议信息03'}
        ]
      }
    } else {
      return { listItemInfos: [] }
    }
  }
}

export default new Controller()
