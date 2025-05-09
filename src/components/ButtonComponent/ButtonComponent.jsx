import React from 'react'
import { Button } from 'antd'
const ButtonComponent = ({size,styleButton,styleTextButton,disabled,textButton,...rests}) => {
  return (
    
    <Button
      disabled={disabled}
      size={size} 
      style={{
        ...styleButton,
        background: disabled ? '#ccc' : styleButton?.backgroundColor 
      }}
      {...rests}
    >
      <span style={styleTextButton}>{textButton}</span>
    </Button>
  )
}

export default ButtonComponent