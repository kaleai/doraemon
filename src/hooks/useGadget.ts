import { useEffect, useState } from 'react'
import { KEY } from '../constant'
import { nanoid } from 'nanoid'
import { ActionHandleResultType, InstallProps } from '../../gadget-template/Interface'
import { loadMicroApp } from 'qiankun'
import { IGadgetInfo, queryGadgetInfo } from '../component/GadgetDetail'
import { LocalHelper } from '../utils'
import { MicroApp } from 'qiankun/es/interfaces'
import { message } from 'antd'
import { IGlobalConfig } from '../interface'

/**
 * @author kale
 *
 * @date 2023/7/11
 */
let gadget: MicroApp

export default (
  globalConfig: IGlobalConfig,
  gadgetInfo: IGadgetInfo | undefined,
  localGadgetInfoList: IGadgetInfo[],
  onReceiveActionHandleResult: (data: ActionHandleResultType) => void,
  onGadgetChange: (info: IGadgetInfo, microApp: MicroApp) => void) => {

  const [loading, setLoading] = useState<boolean>(false)

  const [gadgetsIdMap, setGadgetsIdMap] = useState<Record<string, string>>({})

  const [gadgetInfoList, setGadgetInfoList] = useState<IGadgetInfo[]>([])

  const [doQueryGadget, queryGadgets] = useState<number>()

  useEffect(() => {
    // 加载gadget与id的映射配置表
    const mapObj = LocalHelper.get<Record<string, string>>(KEY.GADGETS_ID_MAP)
    if (mapObj) {
      setGadgetsIdMap(mapObj)
      localStorage.removeItem(KEY.GADGETS_ID_MAP) // 加载完毕后删除本地配置表
    }
  }, [])

  useEffect(() => {
    if (localGadgetInfoList.length > 0) {
      localStorage.setItem(KEY.LOCAL_GADGET_LIST, JSON.stringify(localGadgetInfoList))
    }
  }, [localGadgetInfoList])

  useEffect(() => {
    setLoading(true)
    // 得到本地私有的gadget列表
    const list = LocalHelper.get<IGadgetInfo>(KEY.LOCAL_GADGET_LIST)
    const localGadgetInfoList = list ?? []

    // 加载远端的gadget列表
    const promiseList = globalConfig.gadgets.map(gadget => {
      return queryGadgetInfo(gadget.url)
    })

    Promise.all(promiseList)
      .then(infos => {
        // TODO by kale: 2023/6/21 list根据name去重
        const fullList = infos.concat(localGadgetInfoList)
        setGadgetInfoList(fullList)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
        message.error({ content: '道具加载异常' })
      })

  }, [doQueryGadget])

  useEffect(() => {
    if (!gadgetInfo) {
      return
    }

    setLoading(true)
    gadget?.unmount() // 卸载之前的gadget

    // 安装新的gadget
    const newGadget = installGadgetApp(gadgetInfo.name, gadgetInfo.entryUrl)
    newGadget.mountPromise.then(() => onGadgetChange(gadgetInfo, gadget))
    newGadget.loadPromise.then(() => setLoading(false))
  }, [gadgetInfo])

  const installGadgetApp = (name: string, entryUrl: string): MicroApp => {
    if (!gadgetsIdMap[name]) {
      gadgetsIdMap[name] = nanoid(24)
    }

    // startup parameter for gadget
    const initProps: InstallProps = {
      gid: gadgetsIdMap[name],
      onReceiveActionHandleResult,
      envInfo: {}, // 环境信息，比如是否是浏览器、小程序、vscode插件等
    }

    gadget = loadMicroApp({
      name: name,
      entry: entryUrl,
      container: '#gadgets-container',
      props: initProps,
    }, {
      /*fetch(url, args) { // https://blog.csdn.net/sunqiang4/article/details/122014916
        return window.fetch(url, args)
      },*/
      sandbox: false,
    })

    return gadget
  }

  return {
    loading,
    queryGadgets: () => {
      setGadgetInfoList([])
      queryGadgets(Math.random())
    },
    gadgetInfos: gadgetInfoList,
  }
}

