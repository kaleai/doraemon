import { Avatar } from 'antd'
import { loadMicroApp } from 'qiankun'
import { MicroApp } from 'qiankun/es/interfaces'
import { Button } from 'antd'
import { InstallParams } from '../../../gadgets/template/Interface'
import { HandleResultDataType } from '../../../gadgets/template/Interface'

/**
 * @author Jack Tony
 *
 * @date 2023/5/15
 */
export interface IProps {

  onGadgetChanged: (plugin: MicroApp) => void

  onReceiveViewData: (data: HandleResultDataType) => void
}

export default ({ onGadgetChanged, onReceiveViewData }: IProps) => {

  return <div>
    <Avatar
      shape={'square'}
      src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${2 % 2}`}
      style={{ margin: 12 }}
    />
    <Button onClick={() => {
      // 初始化插件的参数
      const params: InstallParams = {
        onReceiveData: onReceiveViewData,
        envInfo: {}, // 环境信息，比如是否是浏览器、小程序、vscode插件等
      }

      const microApp = loadMicroApp({
        name: 'DebugGadget',
        entry: '//localhost:7031',
        container: '#gadgetContainer',
        props: params,
      }, {
        fetch(url, args) {
          // https://blog.csdn.net/sunqiang4/article/details/122014916
          return window.fetch(url, args);
        },
      })

      onGadgetChanged(microApp)
    }}>
      add plugin
    </Button>
  </div>
}

