
import { WrapperInput } from './style'
const InputForm = ({ placeholder="Nhập text",rules,...rests }) => {
  return (
    <WrapperInput 
      placeholder={placeholder}
      rule={rules}
      {...rests}
    />
  )
}

export default InputForm