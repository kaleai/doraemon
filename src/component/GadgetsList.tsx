import { Avatar, Button, Divider, Input, List, Modal } from 'antd'
import GadgetDetail, { IGadgetInfo } from './GadgetDetail'

interface IProps {
  loading: boolean
  gadgetInfos: IGadgetInfo[],
  onItemSelect: (info: IGadgetInfo) => void
}

export default ({ loading, gadgetInfos,onItemSelect }: IProps) => {

  return <div style={{ width: 325 }}>
    <Divider style={{ margin: 12 }} />
    <Input.Search
      style={{ marginBottom: 14, marginTop: 4 }}
      placeholder="道具名称（支持模糊搜索）"
      allowClear
      enterButton="Search"
      onSearch={() => {
        // TODO by kale: 2023/6/21 搜索
      }}
    />

    <List
      itemLayout="horizontal"
      dataSource={gadgetInfos}
      loading={loading}
      renderItem={(item, index) => (
        <List.Item actions={[
          <Button
            type={'primary'}
            ghost
            size={'small'}
            key="action-link"
            onClick={() => {
              onItemSelect(item)
            }}
          >
            选用
          </Button>,
        ]}
        >
          <List.Item.Meta
            title={<a href={item.homepage}>{item.name}</a>}
            avatar={<Avatar src={item.icon} shape={'square'} />}
            description={
              <div>
                {item.description}
                <a
                  style={{ color: '#1677ff', marginLeft: 6 }}
                  onClick={() => {
                    Modal.info({
                      title: '道具详情',
                      width: 800,
                      content: <GadgetDetail entryUrl={item.entryUrl} />,
                    })
                  }}>
                  {'更多>'}
                </a>
              </div>}
          />
        </List.Item>
      )}
    />
  </div>
}
