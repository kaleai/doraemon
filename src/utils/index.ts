/**
 * @author kale
 * @date 2023/6/30
 *
 * 将对象保存在localStorage中
 */
export const saveObjToLocal = (key: string, obj: Record<any, any> | string): void => {
  if (obj && obj !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(obj))
  }
}

/**
 * 将对象从localStorage中读取
 */
export function loadObjFormLocal<T>(key: string): T | undefined {
  const res = localStorage.getItem(key)
  if (res && res !== 'undefined') {
    return JSON.parse(res) as T
  } else {
    return undefined
  }
}

export function dom2json(id: string) {
  // 获取到dom对象
  const domBox: HTMLElement | null = document.getElementById(id)

  function domJson(dom: any) {
    const obj: {
      tag: string
      attributes?: object,
      children?: any[],
      textContent?: string
    } = {
      tag: getTagName(dom),
    }

    // dom节点为元素element,nodeType节点类型为1
    if (dom.nodeType === 1) {
      const attrs = getTagAttrs(dom)
      if (attrs) obj.attributes = attrs
      // 筛选出nodeType不为3且文本内容不为空的子DOM节点，并进行递归
      obj.children = Array.from(dom.childNodes).filter((child: any) => {
        return !(child.nodeType === 3 && !child.textContent.trim())
      }).map(child => domJson(child))
      return obj
    }
    // dom节点为文本类型， nodeType节点类型为3
    if (dom.nodeType === 3) {
      obj.textContent = handleText(dom.textContent)
      return obj
    }
  }

  // 去除空白符
  function handleText(str: string) {
    return str.replace(/\s/g, '')
  }

  // 获取到节点的标签名，注意需要转换为小写
  function getTagName(dom: HTMLElement) {
    return dom.nodeName.toLocaleLowerCase().replace('#', '')
  }

  // 获取节点的属性对象
  function getTagAttrs(dom: HTMLElement) {
    // 获取到属性数组
    const attr = Array.from(dom.attributes)
    const obj: Record<string, string> = {}
    attr.forEach(atr => obj[atr.name] = atr.value)
    return attr.length ? obj : null
  }

  return domJson(domBox as HTMLElement)
}

// 真正的渲染函数
export function json2dom(node: Record<string, any>): HTMLElement {
  const { tag, textContent, attributes = {}, children } = node

  // 普通DOM
  const dom = document.createElement(tag)

  if (textContent) {
    const textContentEle = document.createTextNode(textContent)
    dom.appendChild(textContentEle)
  }

  if (attributes) {
    // 遍历属性
    Object.keys(attributes).forEach((key) => {
      const attrValue = attributes[key]
      dom.setAttribute(key, attrValue)
    })
  }

  // 子数组进行递归操作
  if (Array.isArray(children) && children?.length > 0) {
    children.forEach((child) => dom.appendChild(json2dom(child)))
  }

  return dom
}
