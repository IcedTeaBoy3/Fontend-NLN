
import ProductDetailsComponent from '../../components/ProductDetailComponent/ProductDetailComponent'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
const ProductDetailsPage = () => {
  const params = useParams()
  const navigate = useNavigate()
  return (
    <>
    
      <div style={{height:'44px',padding: '0 120px',backgroundColor:'rgb(239, 239, 239)',display:'flex',alignItems:'center',borderBottom:'1px solid #ccc'}}>
        <span style={{cursor:'pointer',fontWeight:'bold'}} onClick={() => navigate('/')}>Trang chủ </span>
        / Chi tiết sản phẩm
      </div>
      <div style={{padding: '0 120px',backgroundColor: '#efefef'}}>
        <ProductDetailsComponent idProduct={params.id}/>
      </div>
    </>
  )
}

export default ProductDetailsPage