import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Input, Button } from 'antd'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
function ButtonInputSearch(props) {
  const { 
    size,
    placeholder,
    textbutton,
    bordered='none',
    backgroundColorInput='#fff',
    backgroundColorButton='rgb(13,92,182)',
    colorButton='#fff',
    borderRadius=0,
    ...rests
  } = props
return (
    <div style={{display:'flex'}}>
            <InputComponent 
                size={size} 
                placeholder={placeholder} 
                style={{backgroundColor:backgroundColorInput,borderRadius: borderRadius, border: bordered }}
                {...rests}
            />
            <ButtonComponent 
              size={size} 
              styleButton={{backgroundColor:backgroundColorButton,borderRadius: borderRadius,color:colorButton, border: bordered}}
              styleTextButton={{color:colorButton}}
              textbutton={textbutton}
              icon={<SearchOutlined />}
            />
    </div>
)
}

export default ButtonInputSearch