import { useEffect, useState } from 'react'
import { Avatar, Descriptions } from 'antd'

export interface IGadgetInfo {
  id: string
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
}

export default ({ entryUrl }: IProps) => {

  const [gadgetInfo, setGadgetInfo] = useState<IGadgetInfo>()

  useEffect(() => {
    if (!entryUrl) {
      return
    }

    window.fetch(entryUrl)
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

        setGadgetInfo(obj)
      })
      .catch(error => console.error(error))
  }, [entryUrl])

  if (!gadgetInfo) {
    return <div>loading...</div>
  }

  return <Descriptions title="Gadget Info" bordered>
    {Object.entries(gadgetInfo).map(([key, value]) => {
      return <>
        {<Descriptions.Item key={key} label={key} span={3}>{
          key === 'icon' ? <Avatar shape={'square'} src={value} /> : value
        }</Descriptions.Item>}
      </>
    })}
  </Descriptions>
}
