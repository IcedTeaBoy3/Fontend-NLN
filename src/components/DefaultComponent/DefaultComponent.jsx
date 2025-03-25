import React from 'react'
import HeaderComponent from '../HeaderComponent/HeaderComponent'
import FooterComponent from '../FooterComponent/FooterComponent'
// Function Component vs Class Component thì sử dụng function component nhiều hơn
function DefaultComponent({ children }) {
  return (
    <div>
      <HeaderComponent isHiddenCart={false} isHiddenSearch={false}/>
      {children}
      <FooterComponent />
    </div>
  )
}

export default DefaultComponent