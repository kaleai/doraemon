import { Button, Form, Mentions } from 'antd'
import { ActionInfoType } from '../../../gadget-template/Interface'

interface IProps {
  placeholder: string
  onSubmit: (info: ActionInfoType) => void
}

export default (props: IProps) => {
  const [form] = Form.useForm()

  return <div style={{ background: 'white', padding: 12 }}>
    <Form form={form} onFinish={values => {
      props.onSubmit({
        action: 'SYS_CHAT_BOX_SUBMIT',
        values: { text: values.inputText ?? props.placeholder },
      })
    }}>
      <Form.Item name={'inputText'}>
        <Mentions autoSize placeholder={props.placeholder} />
      </Form.Item>

      <Button type={'primary'} onClick={() => {
        form.submit()
      }}>
        submit
      </Button>
    </Form>
  </div>
}
