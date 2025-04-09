import {memo} from 'react'
import { WarpperInput } from './style'
const InputForm = (props) => {
  const { placeholder="Nhập text",rules,...rests } = props
  return (
    <WarpperInput 
      placeholder={placeholder}
      rule={rules}
      {...rests}
    />
  )
}

export default memo(InputForm)