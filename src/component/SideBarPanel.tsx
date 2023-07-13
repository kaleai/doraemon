import {
  CompassFilled,
  DownloadOutlined,
  MessageFilled,
  MoneyCollectOutlined,
  SettingOutlined,
  UserOutlined,
  GithubFilled,
  PlusCircleFilled,
} from '@ant-design/icons'
import { Menu, Avatar, Space, Button, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { KEY } from '../constant'
import { IConfigEntry, IGlobalConfig } from '../interface'
import md5 from 'js-md5'
import { showDonateDialog } from './DonateDialog'
import { ConversationDBHelper, LocalHelper } from '../utils'
import { nanoid } from 'nanoid'
import './index.css'
import { IGadgetInfo } from './GadgetDetail'

// 下面加起来必须是200
const HEIGHT_TOP_BAR = 112, HEIGHT_BOTTOM_BAR = 88

export interface IConversationInfo {
  id: string,
  name: string
  record?: any
  gadget?: IGadgetInfo
}

interface IProps {
  globalConfig: IGlobalConfig
  onClickSettings: () => void
  selectMenuId: string|undefined
  onMenuClick: (curConversationId: string | undefined, prevConversationId?: string) => void
}

/**
 * @author Jack Tony
 * @date 2023/5/15
 */
export default ({ globalConfig, selectMenuId, onMenuClick, onClickSettings }: IProps) => {

  const [showDonateModal, setShowDonateModal] = useState<boolean>(false)

  const [conversationList, setConversationList] = useState<IConversationInfo[]>([])

  const [defSelectMenuId, setDefSelectMenuId] = useState<string>() // 默认选中的 menu ID

  const [curSelectMenuId, setCurSelectMenuId] = useState<string | undefined>()

  useEffect(() => {
    const onAppWillBeExit = (event: any) => {
      event.preventDefault() // 阻止默认事件

      // 将当前的会话置空
      onMenuClick(undefined, curSelectMenuId)

      return (event.returnValue = 'Are you sure you want to exit?')
    }
    // window.addEventListener('beforeunload', onAppWillBeExit)

    return () => {
      window.removeEventListener('beforeunload', onAppWillBeExit)
    }
  }, [])

  useEffect(() => {
    ConversationDBHelper.queryAll().then(list => {
      list && setConversationList(list)

      const id = LocalHelper.get<string>(KEY.PREV_CONVERSATION_ID)
      setDefSelectMenuId(id ?? list?.[0].id)
    })
  }, [])

  useEffect(() => {
    defSelectMenuId && onMenuClick(defSelectMenuId, curSelectMenuId)
  }, [defSelectMenuId])

  /**
   * 渲染外部跳转网站的ICON
   */
  const renderEntranceIcon = (icon: any, cfgInfo?: IConfigEntry) => {
    return cfgInfo && <Tooltip title={cfgInfo.label}>
      <a className={'dynamicIcon'} href={cfgInfo.url} target={'_blank'}>{icon}</a>
    </Tooltip>
  }

  return <div>
    {showDonateModal &&
      <canvas
        id={'fireworks_canvas'} className={'fireworksCanvas'}
        style={{ width: window.innerWidth, height: window.innerHeight }}
      />
    }

    <div style={{ height: HEIGHT_TOP_BAR, paddingTop: 12, display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginLeft: 10, display: 'flex', alignItems: 'center' }}>
        <Avatar
          className={'userAvatar'}
          icon={<UserOutlined />}
          size={'large'}
          src={LocalHelper.get(KEY.USER_AVATAR)}
        />

        <span style={{ color: 'white', flex: 1, marginLeft: 12 }}>
          {LocalHelper.get(KEY.USER_NAME) ?? '游客用户'}
        </span>

        <Button
          className={'transparentBtn'}
          style={{ opacity: '0.8', width: 26 }}
          type={'default'} size={'small'}
          icon={<SettingOutlined />}
          onClick={onClickSettings}
        />
      </div>

      <Button
        className={'transparentBtn'}
        type={'default'}
        icon={<PlusCircleFilled />}
        onClick={() => {
          const info = { id: md5(nanoid(18)), name: new Date().toLocaleString() }
          ConversationDBHelper.add(info)
          conversationList.push(info)
          setConversationList([...conversationList])
        }}
      >
        新会话
      </Button>
    </div>

    <div className={'sideBarContent'}>
      {defSelectMenuId &&
        <Menu
          style={{ flex: 1 }}
          theme="dark"
          selectedKeys={selectMenuId ? [selectMenuId] : undefined}
          defaultSelectedKeys={[defSelectMenuId]}
          items={conversationList.map(item => ({
            key: item.id,
            label: item.name,
          }))}
          onClick={({ key: id }) => {
            LocalHelper.set(KEY.PREV_CONVERSATION_ID, id)
            setCurSelectMenuId(id)
            onMenuClick(id, curSelectMenuId)
          }}
        />}
    </div>

    <div style={{ height: HEIGHT_BOTTOM_BAR, display: 'flex', flexDirection: 'column' }}>
      <div className={'fullWidth'} style={{ marginTop: 12, display: 'flex' }}>
        {globalConfig.download &&
          <Button
            className={'fullWidth bottomButton'}
            style={{ backgroundColor: '#52c41a' }}
            type={'primary'}
            icon={<DownloadOutlined />}
            onClick={() => {
              window.open(globalConfig.download.url)
            }}
          >
            {globalConfig.download.label}
          </Button>
        }

        {globalConfig.donate &&
          <Button
            className={'fullWidth bottomButton'}
            style={{ backgroundColor: '#eb2f96' }}
            type={'primary'}
            icon={<MoneyCollectOutlined />}
            onClick={() => {
              if (globalConfig.donate.url) {
                window.open(globalConfig.donate.url)
              } else {
                setShowDonateModal(true)
                showDonateDialog(() => setShowDonateModal(false))
              }
            }}
          >
            {globalConfig.donate.label}
          </Button>
        }
      </div>

      <Space style={{ color: 'white', fontSize: 16, marginLeft: 16, marginTop: 14 }} size={'small'}>
        <span style={{ marginRight: 2, fontWeight: 'bold' }}>{globalConfig.title ?? 'Doraemon'}</span>
        {renderEntranceIcon(<CompassFilled />, globalConfig.website.home)}
        {renderEntranceIcon(<MessageFilled />, globalConfig.website.discuss)}
        {renderEntranceIcon(<GithubFilled />, globalConfig.website.github)}
      </Space>
    </div>
  </div>
}
