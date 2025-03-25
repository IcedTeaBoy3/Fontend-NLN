import React from 'react'

import { Image } from 'antd'
import { WrapperSliderStyle } from './style'
const SlideComponent = ({arrImages}) => {
  const Settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,       // Tự động chuyển slide
    autoplaySpeed: 3000,  // Thời gian giữa các lần tự động chuyển (ms)
    arrows: true,         // Hiển thị mũi tên chuyển slide
  }
  return (
    <WrapperSliderStyle {...Settings}>
      {arrImages.map((item, index) => {
        return (
          <Image key={index} src={item} alt="slider" preview={false} width="100%" height="274px"/>
        )
      })}
    </WrapperSliderStyle>
  )
}

export default SlideComponent