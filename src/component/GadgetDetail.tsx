import { useEffect, useState } from 'react'
import { Alert, Avatar, Descriptions } from 'antd'

export interface IGadgetInfo {
  entryUrl: string
  name: string
  icon: string
  version: string
  description: string
  homepage?: string
  author?: string
  keywords?: string[]
  email?: string
  bugReport?: string
}

interface IProps {
  entryUrl: string
  onLoadSuccess?: (info: IGadgetInfo) => void
}

export const queryGadgetInfo = (entryUrl: string): Promise<IGadgetInfo> => {
  return fetch(entryUrl)
    .then(response => response.text())
    .then(htmlString => {
      // 解析 HTML 字符串
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlString, 'text/html')

      // 获取 meta 标签数组
      const metaElements = doc.getElementsByTagName('meta')

      // 遍历 meta 标签数组，输出属性名和属性值
      const obj: any = {}

      for (let i = 0; i < metaElements.length; i++) {
        const meta = metaElements[i]
        // console.log(meta.getAttribute('name') + ': ' + meta.getAttribute('content'))

        const name = meta.getAttribute('name')
        if (name) {
          obj[name] = meta.getAttribute('content')
        }
      }

      obj.entryUrl = entryUrl
      return obj
    })
}

export default ({ entryUrl, onLoadSuccess }: IProps) => {

  const [gadgetInfo, setGadgetInfo] = useState<IGadgetInfo>()

  const [errorReason, setErrorReason] = useState<string | null>()

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!entryUrl) {
      return
    }

    setLoading(true)
    setErrorReason(null)

    queryGadgetInfo(entryUrl)
      .then(info => {
        setGadgetInfo(info)
        setLoading(false)
        onLoadSuccess?.(info)
      })
      .catch(error => {
        console.error(error)
        setErrorReason(error.toString())
        setLoading(false)
      })
  }, [entryUrl])

  if (loading) {
    return <div>loading...</div>
  }

  if (errorReason) {
    return <Alert type={'error'} description={errorReason} />
  }

  if (!gadgetInfo) {
    return null
  }

  return <Descriptions title={gadgetInfo['name']} bordered>
    {Object.entries(gadgetInfo).map(([key, value]) => {
      return <>
        {<Descriptions.Item key={key} label={key} span={3}>{
          key === 'icon' ? <Avatar shape={'square'} src={value} /> : value
        }</Descriptions.Item>}
      </>
    })}
  </Descriptions>
}
