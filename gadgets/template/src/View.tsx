import { IViewElementProps, ActionInfoType } from '../Interface'

export default (
  {
    viewType, data, expectation, onSendAction: sendAction,
  }: IViewElementProps & { onSendAction: (actionInfo: ActionInfoType) => void },
) => {
  return viewType === 'md5Text' ? <span>{data.md5Str}</span> : <div />
}
