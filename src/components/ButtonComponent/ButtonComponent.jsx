import React from 'react'
import { Button } from 'antd'
const ButtonComponent = ({size,styleButton,styleTextButton,disabled,textbutton,...rests}) => {
  return (
    
    <Button
      disabled={disabled}
      size={size} 
      style={{
        ...styleButton,
        background: disabled ? '#ccc' : styleButton.backgroundColor 
      }}
      {...rests}
    >
      <span style={styleTextButton}>{textbutton}</span>
    </Button>
  )
}

export default ButtonComponent