import {memo} from 'react'
import { WarpperInput } from './style'
const InputForm = (props) => {
  const { placeholder="Nhập text",...rests } = props
  return (
    <WarpperInput 
      placeholder={placeholder} 
      {...rests}
    />
  )
}

export default memo(InputForm)