
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { WarpperQuantityProduct, WarpperInputNumber } from './style'
const ProductQuantityControl = ({value,min=1,max=100,onIncrease,onDecrease}) => {
  return (
    <WarpperQuantityProduct>
          
        <button style={{border:'none',padding:'4px 6px',background:'transparent',cursor:'pointer'}} onClick={onDecrease}>
            <MinusOutlined style={{fontSize:'20px',color:'#000'}}  />
        </button>
    
        <WarpperInputNumber min={min} max={max} value={value} readOnly />

        <button style={{border:'none',padding:'4px 6px',background:'transparent',cursor:'pointer'}} onClick={onIncrease}>
            <PlusOutlined style={{fontSize:'20px',color:'#000'}} />
        </button>

    </WarpperQuantityProduct>
  )
}

export default ProductQuantityControl