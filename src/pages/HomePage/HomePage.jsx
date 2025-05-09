
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import SlideComponent from '../../components/SlideComponent/SlideComponent'
import { WarpperTypeProduct,WarpperButtonMore,WarpperProducts } from './style'
import slider1  from '../../assets/images/slider_2.webp'
import slider2 from '../../assets/images/slider_3.jpg'
import slider3 from '../../assets/images/slider_4.png'
import CardComponent from '../../components/CardComponent/CardComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import { useDebounceHook } from '../../hooks/useDebounceHook'
import { useSelector } from 'react-redux'
import { useState } from 'react'
// import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
import CriteriaComponent from '../../components/CriteriaComponent/CriteriaComponent'
function HomePage() {

  const searchProduct = useSelector(state => state.product?.search)
  const searchProductDebounce = useDebounceHook(searchProduct, 1000)
  // const [typeProduct, setTypeProduct] = useState([])
  const [limit, setLimit] = useState(6)
  const fetchAllProducts = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProducts(search,limit)
    return res
  }
  const fetchAllProductsType = async () => {
    const res = await ProductService.getAllProductsType()
    return res
  }


  const {isLoading:isLoadingProduct,data: products,isPreviousData} = useQuery({ 
    queryKey:['products',limit,searchProductDebounce], 
    queryFn:fetchAllProducts, 
    retry: 3, 
    retryDelay: 1000,
    keepPreviousData: true, 
  })
  const { isLoading:isLoadingTypeProduct,data: typeProducts = [] } = useQuery({
    queryKey: ['product-types'],
    queryFn: fetchAllProductsType,
    staleTime: 1000 * 60 * 10,
  })
  
  return (
    <>
      <div style={{ width:'1270px', margin: '0 auto'}}>
        <WarpperTypeProduct>
          {typeProducts?.data?.map((type,index) => {
            return <TypeProduct key={index} name={type} />
          })}
        </WarpperTypeProduct>
      </div>
      <div className='body' style={{width:'100%',backgroundColor: '#efefef'}}>
        <div id="container" style={{width: '1270px', margin: '0 auto'}}>

          <SlideComponent arrImages={[slider1,slider2,slider3]}/>
          <LoadingComponent isLoading={isLoadingProduct}>

            <WarpperProducts>
              { products?.data.map((product) => {
                return (
                  <CardComponent 
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
                )
              })}

            </WarpperProducts>
            <div style={{width:'100%',display: 'flex', justifyContent: 'center', marginTop: '20px'}}>

              <WarpperButtonMore 
                textButton={ isPreviousData ? 'Loading...' : products?.totalProducts === products?.data?.length ? 'Đã hiển thị tất cả sản phẩm' : 'Xem thêm sản phẩm'}
                type='outline' 
                styleButton={{border: '1px solid rgb(11,116,229',color:'rgb(11,116,229)',width:'240px',height:'38px',borderRadius:'4px'}}
                styleTextButton={{fontWeight:'500',marginTop:'3px',color: products?.totalProducts === products?.data?.length && '#fff'}}
                // icon={<i className="fas fa-chevron-down"></i>}
                onClick={() => setLimit(limit + 6)}
                disabled={products?.totalProducts === products?.data?.length || products?.totalPage == 1}
              />
            </div>
          </LoadingComponent>
          
        </div>
        <CriteriaComponent />
      </div>

    </>
  )
}

export default HomePage