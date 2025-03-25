
import { Row, Col,Image, Rate } from 'antd'
import ImageProductSmall from '../../assets/images/Samsung_Galaxy_A34_Small.jpg'
import { WarpperStyleImageSmall,WarpperProductName,WarppperStarProduct,WarpperProductPrice,WarpperProducTextPrice,WarpperAddressProduct, WarpperQuantityProduct,WarpperInputNumber } from './style'
import { MinusOutlined,PlusOutlined,ShoppingCartOutlined} from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import LoadingComponent from '../LoadingComponent/LoadingComponent'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addOrderProduct} from '../../redux/Slides/orderSlide'
import * as Message from '../Message/Message'
import { convertPrice } from '../../utils'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
import CommentComponent from '../CommentComponent/CommentComponent'

const ProductDetailComponent = ({idProduct}) => {
    
    const [quantity, setQuantity] = useState(1)
    const user = useSelector(state => state.user)
    const order = useSelector(state => state.order)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const fetchProductDetail = async (context) => {
        const idProduct = context?.queryKey && context?.queryKey[1]
        const res = await ProductService.getDetailProduct(idProduct)
        return res.data
    }

    const { isLoading, data: product } = useQuery({
        queryKey: ['product', idProduct],
        queryFn: fetchProductDetail,
        enabled: !!idProduct,
        retry: 3,
        retryDelay: 1000,
    })
    
    const handleChangeQuantity = (value) => {
        if (value < 1) {
            setQuantity(1);
        } else if (value > product?.countInStock) {
            setQuantity(product?.countInStock);
        } else {
            setQuantity(value);
        }
    };
    
    const handleIncreaseQuantity = () => {
        
        setQuantity((prev) => (prev < product?.countInStock ? prev + 1 : prev));
    };
    
    const handleDecreaseQuantity = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
    };

    
    const handleAddOrderProduct = () => {
        if(!user?._id){
           navigate('/sign-in',{state:location?.pathname})
        }else{
            const orderRedux = order?.orderItems.find(item => item.product === product?._id)
            if(orderRedux?.amount + quantity > product?.countInStock){
                Message.error(`Số lượng sản phẩm ${product?.name} trong giỏ hàng vượt quá số lượng tồn kho`)
                return
            }
            dispatch(addOrderProduct({
                orderItems: {
                    name: product?.name,
                    amount: quantity,
                    image: product?.image,
                    price: product?.price,
                    product: product?._id,
                    discount: product?.discount,
                    countInStock: product?.countInStock
                }
            }))
            Message.success("Thêm sản phẩm vào giỏ hàng thành công");
        }
    }
    return (
        <LoadingComponent isLoading={isLoading}>
            <Row style={{backgroundColor:'#fff',borderRadius:'8px',padding:'16px'}}>
                <Col span={10} style={{borderRight:'1px solid #efefef',display:'flex',flexDirection:'column',alignItems:'center',paddingRight:'16px'}} >
                    <Image src={product?.image} width={368} height={368} alt="Samsung Galaxy A34" preview={false} />
                    <Row style={{paddingTop:'10px',justifyContent:'space-between',gap:'10px',flexBasis:'unset'}}>
                        <Col span={4}>
                            <WarpperStyleImageSmall src={ImageProductSmall} alt="Samsung Galaxy A34" preview={false} />
                        </Col>
                        <Col span={4}>
                            <WarpperStyleImageSmall src={ImageProductSmall} alt="Samsung Galaxy A34" preview={false} />

                        </Col>
                        <Col span={4}>
                            <WarpperStyleImageSmall src={ImageProductSmall} alt="Samsung Galaxy A34" preview={false} />

                        </Col>
                        <Col span={4}>
                            <WarpperStyleImageSmall src={ImageProductSmall} alt="Samsung Galaxy A34" preview={false} />

                        </Col>
                        <Col span={4}>
                            <WarpperStyleImageSmall src={ImageProductSmall} alt="Samsung Galaxy A34" preview={false} />

                        </Col>
                    </Row>
                </Col>
                <Col span={14} style={{paddingLeft:'16px'}}>
                    <WarpperProductName>{product?.name}</WarpperProductName>
                    <WarppperStarProduct>
                        <span style={{fontWeight:'500'}}>{product?.rating}</span>
                        <span style={{borderRight:'1px solid #ccc',paddingRight:'8px'}}>
                        <Rate allowHalf defaultValue={product?.rating} value={product?.rating} />
                        </span>
                        <span> Đã bán {product?.selled}+</span>
                    </WarppperStarProduct>
                    <WarpperProductPrice>
                        <WarpperProducTextPrice>
                        <span className="text-gray-500 line-through">
                            {convertPrice(product?.price)}
                        </span>
                        <span className="font-bold text-red-500 px-2">
                            {convertPrice(product?.price * (1 - product?.discount / 100))}
                        </span>
                        </WarpperProducTextPrice>
                        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded md:text-sm ">
                            -{product?.discount}%
                        </span>
                        <span></span>
                    </WarpperProductPrice>
                    <WarpperAddressProduct>
                        <div>

                            <span>Giao đến </span>
                            <span className="address">{user?.address}</span>
                        </div>
                        <span className="change-address">Đổi địa chỉ</span>

                    </WarpperAddressProduct>
                    <LikeButtonComponent  dataHref={import.meta.env.VITE_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/" : window.location.href} />
                    <div style={{margin:'10px 0 20px',borderBottom:'1px solid rgb(239, 239, 239)',paddingBottom:'20px',borderTop:'1px solid rgb(239, 239, 239)',paddingTop:'20px'}}>
                        <div style={{marginBottom:'6px'}}>Số lượng</div>
                        <WarpperQuantityProduct>

                            <button style={{border:'none',padding:'4px',background:'transparent',cursor:'pointer'}} onClick={handleDecreaseQuantity}>

                                <MinusOutlined style={{fontSize:'20px',color:'#000'}}  />
                            </button>
                        
                            <WarpperInputNumber min={1} max={product?.countInStock} value={quantity} onChange={handleChangeQuantity} />
                            <button style={{border:'none',padding:'4px',background:'transparent'}} onClick={handleIncreaseQuantity}>

                                <PlusOutlined style={{fontSize:'20px',color:'#000',cursor:'pointer'}}  />
                            </button>
            
                        </WarpperQuantityProduct>
                        <div className='mt-3'>

                            { product?.countInStock === 0 && <span className='text-red-600'>* Sản phẩm đã hết hàng</span>}
                        </div>
                    </div>
                    <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
                        <ButtonComponent 
                            size={40} 
                            styleButton={{
                                backgroundColor:'rgb(255,57,69)',
                                border:'none',
                                borderRadius:'4px',
                                height:'48px',
                                width:'220px',
                            
                            }}
                            styleTextButton={{
                                color:'#fff',
                                fontSize:'16px',
                                fontWeight:'500',
                                marginTop:'6px'
                            }}
                            disabled={product?.countInStock === 0}
                            textbutton={'Mua ngay'}
                            onClick = {handleAddOrderProduct}
                            icon={<ShoppingCartOutlined style={{fontSize:'30px',color:'#fff',display:'none'}} />}
                        />
                        <ButtonComponent 
                            size={40} 
                            styleButton={{border:'1px solid rgb(13,92,182)',borderRadius:'4px',height:'48px',width:'220px'}}
                            styleTextButton={{color:'rgb(13,92,182)',fontSize:'16px',marginTop:'6px'}}
                            textbutton={'Mua trả sau'}
                            icon={<ShoppingCartOutlined style={{fontSize:'30px',color:'#fff',display:'none'}} />}

                        />
                    </div>
                </Col>
                <CommentComponent dataHref={import.meta.env.VITE_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/" : window.location.href} />
            </Row>
            
        </LoadingComponent>
    )
}

export default ProductDetailComponent