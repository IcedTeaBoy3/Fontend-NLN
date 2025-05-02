
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
import { updateUser } from '../../redux/Slides/userSlide'
import { addOrderProduct} from '../../redux/Slides/orderSlide'
import * as Message from '../Message/Message'
import { convertPrice } from '../../utils'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
import CommentComponent from '../CommentComponent/CommentComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import InputComponent from '../InputComponent/InputComponent'
import ModalAuthentication from '../ModalAuthentication/ModalAuthentication' 
import { Form } from 'antd'
import { useMutationHook } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'

const ProductDetailComponent = ({idProduct}) => {
    
    const [quantity, setQuantity] = useState(1)
    const user = useSelector(state => state.user)
    const order = useSelector(state => state.order)

    const [isOpenModal, setIsOpenModal] = useState(false);
    const handleOk = () => {
        setIsOpenModal(false);
    };
    const handleCancel = () => setIsOpenModal(false);
    const dispatch = useDispatch()
    const fetchProductDetail = async (context) => {
        const idProduct = context?.queryKey && context?.queryKey[1]
        const res = await ProductService.getDetailProduct(idProduct)
        return res.data
    }
    // Lưu chi tiết một người dùng
    const [stateUserDetail, setStateUserDetail] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        email: '',

    })
    // Gọi API cập nhật người dùng
    const mutationUpdate = useMutationHook((data) => {
        const { id,access_token, ...rests } = data
        return UserService.updateUser(id,rests,access_token)
    })
    const { data: dataUpdate, isPending: loadingUpdate } = mutationUpdate;
    useEffect(() => {
        if(dataUpdate?.status === "success"){
          Message.success("Cập nhật thông tin thành công!");
          setIsModalUpdateInfo(false);
          dispatch(updateUser({
            ...stateUserDetail
          }));
        }else if(dataUpdate?.status === "error"){
          Message.error("Cập nhật thông tin thất bại vui lòng thử lại sau!");
          
        }
    }, [dataUpdate]);
    const [isModalUpdateInfo, setIsModalUpdateInfo] = useState(false);
    const [formUpdate] = Form.useForm();
    // Cập nhật lại thông tin người dùng
      useEffect(() => {
        if(isModalUpdateInfo){
          setStateUserDetail({
            name: user?.name,
            phone: user?.phone,
            address: user?.address,
            city: user?.city,
            email: user?.email
          });
        }
      }, [isModalUpdateInfo]);
    
    const handleUpdateInfo = () => {
        const { name, phone, address, city } = stateUserDetail; 
        if(name && phone && address && city){
          mutationUpdate.mutate({
            id: user?._id,
            access_token: user?.access_token,
            ...stateUserDetail,
          })
        }
    }
    const handleCancelUpdateInfo = () => {
        setStateUserDetail({
          name: "",
          phone: "",
          address: "",
          city: ""
        })
        formUpdate.resetFields();
        setIsModalUpdateInfo(false);
    }
    useEffect(() => {
        formUpdate.setFieldsValue(stateUserDetail);
    },[formUpdate, stateUserDetail])

    // Xử lý khi thay đổi input khi cập nhật người dùng
    const handleOnchangeDetail = (e) => {
        setStateUserDetail({
            ...stateUserDetail,
            [e.target.name]: e.target.value
        })
    }
    // Mở modal cập nhật địa chỉ
    const handleChangeAddress = () => {
        if(!user?.access_token){
            Message.warning("Vui lòng đăng nhập để cập nhật thông tin giao hàng")
            setIsOpenModal(true)
            return
        }
        setIsModalUpdateInfo(true);
    }

    const { isLoading, data: product } = useQuery({
        queryKey: ['product', idProduct],
        queryFn: fetchProductDetail,
        enabled: !!idProduct,
        retry: 3,
        retryDelay: 1000,
    })
    
    const handleIncreaseQuantity = () => {
        setQuantity((prev) => (prev + 1 > product?.countInStock ? product?.countInStock+1 : prev + 1));
    };
    
    const handleDecreaseQuantity = () => {
        setQuantity((prev) => (prev - 1 < 1 ? 1 : prev - 1));
    };

    
    const handleAddOrderProduct = () => {
        if(!user?._id){
            Message.warning("Vui lòng đăng nhập để mua hàng")
            setIsOpenModal(true)
            return
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
        <>
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
                        </WarpperProductPrice>
                        <WarpperAddressProduct>
                            <div>

                                <span>Giao đến </span>
                                <span className="address">{user?.address}-{user?.city}</span>
                            </div>
                            <span className="change-address" onClick={handleChangeAddress}>Đổi địa chỉ</span>

                        </WarpperAddressProduct>
                        <LikeButtonComponent  dataHref={import.meta.env.VITE_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/" : window.location.href} />
                        <div style={{margin:'10px 0 20px',borderBottom:'1px solid rgb(239, 239, 239)',paddingBottom:'20px',borderTop:'1px solid rgb(239, 239, 239)',paddingTop:'20px'}}>
                            <div style={{marginBottom:'6px'}}>Số lượng:</div>
                            <WarpperQuantityProduct>

                                <button style={{border:'none',padding:'4px',background:'transparent',cursor:'pointer'}} onClick={handleDecreaseQuantity}>

                                    <MinusOutlined style={{fontSize:'20px',color:'#000'}}  />
                                </button>
                            
                                <WarpperInputNumber min={1} value={quantity} readOnly />
                                <button style={{border:'none',padding:'4px',background:'transparent'}} onClick={handleIncreaseQuantity}>

                                    <PlusOutlined style={{fontSize:'20px',color:'#000',cursor:'pointer'}}  />
                                </button>
                
                            </WarpperQuantityProduct>
                            <div className='mt-3'>
                                { product?.countInStock === 0 && <span className='text-red-600'>* Sản phẩm đã hết hàng</span>}
                                { quantity > product?.countInStock && <span className='text-red-600'>* Số lượng sản phẩm quá số lượng tồn kho</span>}
                            </div>
                        </div>
                        <p><span style={{fontWeight:'bold'}}>Mô tả:</span> {product?.description}</p>
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
                                disabled={product?.countInStock === 0 || quantity > product?.countInStock}
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
            <ModalComponent
            title="Cập nhật thông tin giao hàng"
            open={isModalUpdateInfo}
            onOk={handleUpdateInfo}
            onCancel={handleCancelUpdateInfo}
            style={{ borderRadius: 0 }}
            >
                <LoadingComponent isLoading={loadingUpdate}>
                    <Form
                        name="formUpdate"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        style={{ maxWidth: 600, padding: '20px' }}
                        initialValues={{ remember: true, }}
                        // onFinish={handleOnUpdateUser}
                        autoComplete="off"
                        form={formUpdate}

                    >
                        <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your Name!',
                            },
                        ]}
                        >
                            <InputComponent value={stateUserDetail.name} onChange={handleOnchangeDetail} name="name" />
                        </Form.Item>
                        <Form.Item
                        label="City"
                        name="city"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your city!',
                            },
                        ]}
                        >
                        <InputComponent value={stateUserDetail.city} onChange={handleOnchangeDetail} name="city" />
                        </Form.Item>

                        <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your phone!',
                            },
                            {
                            pattern: new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/),
                            message: 'Phone number is not valid!'
                            }
                        ]}
                        >
                            <InputComponent value={stateUserDetail.phone} onChange={handleOnchangeDetail} name="phone" />
                        </Form.Item>
                        <Form.Item
                        label="Address"
                        name="address"
                        rules={[
                            {
                            required: true,
                            message: 'Please input your address!',
                            }

                        ]}
                        >
                            <InputComponent value={stateUserDetail.address} onChange={handleOnchangeDetail} name="address" />
                        </Form.Item>

                        
                    </Form>
                </LoadingComponent>`
            </ModalComponent>
            <ModalAuthentication
                isOpen={isOpenModal}
                handleOk={handleOk}
                handleCancel={handleCancel}
                width={800}
                footer={null}>
            </ModalAuthentication>
        </>
        
    )
}

export default ProductDetailComponent