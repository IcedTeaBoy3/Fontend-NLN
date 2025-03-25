import React from 'react'
import { WarpperLabelText,WarpperTypeProduct,WarpperContent,WarpperTextPrice } from './style'
import { Checkbox,Rate } from 'antd'
import { FilterFilled  } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { filterProductByPrice,filterProductByStar } from '../../redux/Slides/productSlide'
import { useState } from 'react'
const NavbarComponent = () => {
    const dispatch = useDispatch()
    const [selectedPrice,setSelectedPrice] = useState('')
    const [selectedStar,setSelectedStar] = useState('')
    const handleFilterPrice = (price) => {
        dispatch(filterProductByPrice(price))
    }
    const handleFilterByStar = (star) => {
        dispatch(filterProductByStar(star))  
    }

    const renderContent = (type,options) => {
    
    switch(type){
        case 'text':
            return options.map((item,index) => {
                return <WarpperTypeProduct key={index}>{item}</WarpperTypeProduct>
            })
        case 'checkbox':
            return (
                <Checkbox.Group style={{ width: '100%',display:'flex',flexDirection:'column' }} >
                    {options.map((item,index) => {
                        return <Checkbox key={index} value={item.value}>{item.label}</Checkbox>
                    })}
                </Checkbox.Group>
            )
        case 'star':
           
            return (
                
                
                <Rate allowHalf defaultValue={3} value={selectedStar} onChange={(value) => {
                    setSelectedStar(value)
                    handleFilterByStar(value)}
                }/>
                
            )
        case 'price':
            return options.map((item,index) => {
                return (
                    <WarpperTextPrice key={index} 
                        style={{
                            display:'flex',
                            gap:'4px',
                            fontSize:'12px',
                            cursor:'pointer',
                            backgroundColor: selectedPrice === item ? "rgb(56,56,61)" : "rgb(238,238,238)", // Đổi màu khi được chọn
                            color: selectedPrice === item ? "white" : "rgb(56,56,61)", // Đổi màu chữ khi được chọn
                        }} 
                        onClick={() => {
                            setSelectedPrice(item);
                            handleFilterPrice(item);
                        }}

                    >
                       {item}
                    </WarpperTextPrice>
                )
            })
        default:
            return {}
    }
  }
  return (
    <div>
        <WarpperLabelText><FilterFilled /> Lọc sản phẩm</WarpperLabelText>
        <WarpperContent>
            Theo số sao:
            {renderContent('star',['4'])}
        </WarpperContent>
        <WarpperContent>
            Theo giá sản phẩm: 
            {renderContent('price',['Tất cả','Từ 0 - 2tr','2tr - 10tr','10tr - 20tr','20tr - 30tr','30tr - 50tr','trên 50tr'])}
        </WarpperContent>
    </div>
  )
}

export default NavbarComponent