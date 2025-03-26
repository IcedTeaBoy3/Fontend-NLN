
import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { WarpperProducts,WarpperNavbar } from './style'
import { Row,Col,Pagination } from 'antd'
import { useLocation } from 'react-router-dom'
import * as ProductService from '../../services/ProductService'
import { useEffect,useState } from 'react'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import { useSelector,useDispatch } from 'react-redux'
import { useDebounceHook } from '../../hooks/useDebounceHook'
import { useNavigate } from 'react-router-dom'
import { updateProduct } from "../../redux/Slides/productSlide";


const TypeProductPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const filterProducts = useSelector(state => state.product?.filterProducts)
  const searchProduct = useSelector(state => state.product?.search)
  const searchProductDebounce = useDebounceHook(searchProduct, 500)
  const {state} = useLocation()
  const [loading,setLoading] = useState(false)
  const [panigate,setPanigate] = useState({
    page: 0,
    limit: 10,
    total: 1
  })
  const fetchProductType = async (type,page,limit) => {
    setLoading(true)
    const res = await ProductService.getProductType(type,page,limit)
    
    if(res?.status === 'success'){
      setLoading(false)
      dispatch(updateProduct(res?.data))
      setPanigate({ ...panigate, total: res?.totalPages })
      
    }
    else{
      setLoading(false)
    }
  }
  useEffect(() => {
    if(state){
      fetchProductType(state,panigate.page,panigate.limit)
    }
  },[state,panigate.page,panigate.limit])


  const handlePagination = (current,pageSize) => {
    setPanigate({ ...panigate, page: current-1, limit: pageSize })
  }
  return (
    <>
      <div style={{height:'44px',padding: '0 120px',backgroundColor:'#fff',display:'flex',alignItems:'center', borderBottom:'1px solid #ccc'}}>
        <span style={{cursor:'pointer',fontWeight:'bold'}} onClick={() => navigate('/')}>Trang chủ </span>
        / <span style={{cursor:'pointer',fontWeight:'bold'}}>{state}</span>
      </div>
      <LoadingComponent isLoading={loading}>
        <div style={{width:'100%',background:'#efefef'}}>
          <div style={{width:'1270px',margin:'0 auto'}}>
      
            <Row style={{flexWrap: 'nowrap',paddingTop: '10px',paddingBottom: '20px'}}> 
                <WarpperNavbar span={4}>
                  <NavbarComponent />
                </WarpperNavbar>
                
                <Col span={20} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <WarpperProducts >
                    
                    {filterProducts?.filter((pro)=> {
                      if(searchProductDebounce === ''){
                        return pro
                      }
                      else if(pro.name.toLowerCase().includes(searchProductDebounce.toLowerCase())){
                        return pro
                      }
                    }).map((product) => {
                      return <CardComponent 
                        key={product._id}
                        name={product.name} 
                        image={product.image}
                        description={product.description} 
                        price={product.price} 
                        countInStock={product.countInStock}
                        rating={product.rating}
                        type={product.type}
                        discount={product.discount}
                        selled={product.selled}
                        id={product._id}
                      />
                    })}
                  
                  </WarpperProducts>
                  <Pagination
                    showSizeChanger
                    
                    defaultCurrent={panigate.page+1}
                    total={panigate?.total}
                    onChange={handlePagination}
                    style={{display:'flex',justifyContent:'center',marginTop:'10px'}}
                  />
                </Col>
            </Row>
          </div>
        </div>
      </LoadingComponent>
    </>
  )
}

export default TypeProductPage