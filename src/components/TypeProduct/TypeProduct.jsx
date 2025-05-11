import React from 'react'
import { useNavigate,useLocation } from 'react-router-dom'

const TypeProduct = ({name}) => {
  const location = useLocation();
  const isActive = location?.state === name 
  const navigate = useNavigate()
  const handleNavigateTypeProduct = (type) => {
    navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/ /g, '-')}`, { state: type })
  }
  return (
    <div className='hover:bg-[#ccc] hover:text-white' 
    style={{padding:'14px 20px',color: isActive ? "white" : undefined,cursor:'pointer',borderRadius:'6px', backgroundColor: isActive ? '#ccc' : undefined}} 
    onClick={() => handleNavigateTypeProduct(name)}
  >
      {name}
    </div>
  )
}

export default TypeProduct