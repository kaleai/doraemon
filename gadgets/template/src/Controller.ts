import { ActionInfoType, ConversationDataType, SYS_ACTION_NAME, SysViewElementInfo } from '../Interface'

const md5 = require('js-md5')

class Controller {

  public async handleAction({ action, expectation, values }: ActionInfoType): Promise<ConversationDataType> {
    console.log('handle action:', action, expectation, values)

    if (action === SYS_ACTION_NAME.INITIALIZATION || action === 'RE_INPUT') {
      return {
        conversationId: 'id:' + Math.random(),
        viewElementInfos: [new SysViewElementInfo.ChatBox({ placeholder: 'please input some text' }, 'exp')],
      }
    }

    if (action === SYS_ACTION_NAME.CHAT_BOX_SUBMIT) {
      return {
        conversationId: 'id:' + Math.random(),
        viewElementInfos: [{ viewType: 'md5Text', data: { md5Str: md5(values.text) } }],
        suggestActions: [{ label: '再次输入', actionInfo: { action: 'RE_INPUT' } }],
      }
    }

    return { conversationId: '', viewElementInfos: [] } // default
  }
}

export default new Controller()
