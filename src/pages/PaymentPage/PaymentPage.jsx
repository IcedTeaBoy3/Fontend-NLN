import { useEffect, useMemo, useState } from "react";
import { Button,  Card, Typography, Row, Col, message, Form,Radio } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {  removeMultipleOrderProducts } from "../../redux/Slides/orderSlide";
import { convertPrice } from "../../utils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";  
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService"; 
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { updateUser } from "../../redux/Slides/userSlide";
import { useNavigate } from "react-router-dom";
import  * as OrderService from "../../services/OrderService";
import PayPalButton from "../../components/PaypalButton/PaypalButton";
const { Title, Text } = Typography;

const PaymentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [isModalUpdateInfo, setIsModalUpdateInfo] = useState(false);
  const [formUpdate] = Form.useForm();
  const [shippingMethod, setShippingMethod] = useState("FAST");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Lưu chi tiết một người dùng
  const [stateUserDetail, setStateUserDetail] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
  })
  // Gọi API cập nhật người dùng
  const mutationUpdate = useMutationHook((data) => {
    const { id,access_token, ...rests } = data
    return UserService.updateUser(id,rests,access_token)
  })
  const { data: dataUpdate, isPending: loadingUpdate } = mutationUpdate;
  // Gọi API tạo đơn hàng mới
  const mutationAddOrder = useMutationHook((data) => {
    const { access_token, ...rests } = data;
    return OrderService.createOrder(rests,access_token);
 })
 const { data: dataAddOrder, isPending: loadingAddOrder } = mutationAddOrder;

  useEffect(() => {
    if(dataUpdate?.status === "success"){
      message.success("Cập nhật thông tin thành công!");
      setIsModalUpdateInfo(false);
      dispatch(updateUser({
        ...stateUserDetail
      }));
    }else if(dataUpdate?.status === "error"){
      message.error("Cập nhật thông tin thất bại vui lòng thử lại sau!");
      
    }
  }, [dataUpdate]);


  useEffect(() => {
    if(dataAddOrder?.status === "success"){
      const arrayOrder = [];
      order?.orderItemsSelected.forEach(item => {
        arrayOrder.push(item.product)
      })
      dispatch(removeMultipleOrderProducts(arrayOrder));
      message.success("Đặt hàng thành công!");
      navigate('/order-success', { state: {
        paymentMethod,
        shippingMethod,
        orders: order?.orderItemsSelected,
        totalPrice,
      }});
    }else if(dataAddOrder?.status === "error"){
      message.error(dataAddOrder?.message);
    }
  }, [dataAddOrder]);

  // Cập nhật lại thông tin người dùng
  useEffect(() => {
    if(isModalUpdateInfo){
      setStateUserDetail({
        name: user?.name,
        phone: user?.phone,
        address: user?.address,
        city: user?.city
      });
    }
  }, [isModalUpdateInfo]);

  const { tempPrice, priceDiscount, deliveryPrice, totalPrice } = useMemo(() => {
    if (!order?.orderItemsSelected?.length) {
      return {
        tempPrice: 0,
        priceDiscount: 0,
        deliveryPrice: 30_000, // Giá mặc định nếu không có sản phẩm
        totalPrice: 30_000
      };
    }
  
    // Tính tạm tính
    const tempPrice = order?.orderItemsSelected.reduce((total, item) => total + item.price * item.amount, 0);
    
    // Tính giảm giá
    const priceDiscount = order?.orderItemsSelected.reduce((total, item) => {
      const discount = (item.price * item.discount) / 100;
      return total + discount * item.amount;
    }, 0);
  
    // Tính phí giao hàng
    let deliveryPrice = 30_000;
    if (tempPrice >= 5_000_000) deliveryPrice = 0;
    else if (tempPrice >= 2_000_000) deliveryPrice = 20_000;
  
    // Tính tổng tiền
    const totalPrice = Math.max(0, tempPrice - priceDiscount + deliveryPrice);
  
    return { tempPrice, priceDiscount, deliveryPrice, totalPrice };
  }, [order]);
  

  const handleAddOrder = () => {
    
    
    if(user?.access_token && order?.orderItemsSelected && user?.name && user?.phone && user?.address && user?.city && paymentMethod && tempPrice && totalPrice){
      
      mutationAddOrder.mutate({
        access_token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        phone: user?.phone,
        address: user?.address,
        city: user?.city,
        paymentMethod,
        shippingMethod,
        itemsPrice: tempPrice,
        shippingPrice: deliveryPrice,
        totalPrice: totalPrice,
        user: user?._id,
        email: user?.email,
      });
    }
 
  }

  const handleAddOrderPaypal = () => {
    if(user?.access_token && order?.orderItemsSelected && user?.name && user?.phone && user?.address && user?.city && paymentMethod && tempPrice && totalPrice){
      
      mutationAddOrder.mutate({
        access_token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        phone: user?.phone,
        address: user?.address,
        city: user?.city,
        paymentMethod,
        shippingMethod,
        itemsPrice: tempPrice,
        shippingPrice: deliveryPrice,
        totalPrice: totalPrice,
        user: user?._id,
        isPaid: true,
        paidAt: new Date(),
        email: user?.email,
      });
    }
  }

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
    setIsModalUpdateInfo(true);
  }
 

  return (
    <>
      <div style={{height:'44px',padding: '0 120px',backgroundColor:'rgb(239, 239, 239)',display:'flex',alignItems:'center',borderBottom:'1px solid #ccc'}}>
        <span style={{cursor:'pointer',fontWeight:'bold'}} onClick={() => navigate('/')}>Trang chủ </span>
        <span style={{cursor:'pointer',fontWeight:'bold'}} onClick={() => navigate('/order')}>/ Giỏ hàng </span>
        / Thanh toán
      </div>
      <LoadingComponent isLoading={loadingAddOrder}>
        <Row gutter={16} style={{ padding: 40, backgroundColor: '#f0f2f5' }}>
          <Col span={16}>
              <Title level={4}>Thanh Toán</Title>
              {/* Chọn phương thức giao hàng */}
              <Card className="mb-4 bg-blue-100">
                  <h3 className="font-medium mb-2">Chọn phương thức giao hàng</h3>
                  <Radio.Group onChange={(e) => setShippingMethod(e.target.value)} value={shippingMethod}>
                    <div className="flex flex-col gap-2">
                      <Radio value="FAST">
                        <Text strong className="text-blue-600">FAST</Text> Giao hàng tiết kiệm
                      </Radio>
                      <Radio value="GO_JEK">
                        <Text strong className="text-orange-500">GO_JEK</Text> Giao hàng tiết kiệm
                      </Radio>
                    </div>
                  </Radio.Group>
              </Card>

              {/* Chọn phương thức thanh toán */}
              <Card className="bg-blue-100">
                  <h3 className="font-medium mb-2">Chọn phương thức thanh toán</h3>
                  <Radio.Group onChange={(e) => setPaymentMethod(e.target.value)} value={paymentMethod}>
                    <div className="flex flex-col gap-2">
                      <Radio value="COD">Thanh toán tiền mặt khi nhận hàng</Radio>
                      <Radio value="Paypal">Thanh toán bằng Paypal</Radio>
                    </div>
                  </Radio.Group>
              </Card>
          </Col>

          {/* Tổng kết đơn hàng */}
          <Col span={8}>
            <Card>
              <span style={{fontWeight:'bold'}}>Địa chỉ: </span>
              <Title level={5}>{`${user?.address} ${user?.city}` }</Title>
              <span style={{color:'blue',cursor:'pointer'}} onClick={handleChangeAddress}>Thay đổi</span>
            </Card>
            <Card style={{ marginTop: 20 }}>
              <Row justify="space-between">
                <Text>Tạm tính</Text> <Text>{convertPrice(tempPrice)}</Text>
              </Row>
              <Row justify="space-between">
                <Text>Giảm giá</Text> <Text>{convertPrice(priceDiscount)}</Text>
              </Row>
              <Row justify="space-between">
                <Text>Phí giao hàng</Text> <Text>{convertPrice(deliveryPrice)}</Text>
              </Row>
              <Row justify="space-between" style={{ marginTop: 10 }}>
                <Title level={4}>Tổng tiền</Title>
                <Title level={3} type="danger">{convertPrice(totalPrice)}</Title>
              </Row>
              <Text type="secondary">(Đã bao gồm VAT nếu có)</Text>
              {paymentMethod === "Paypal" ? (
                <PayPalButton amount={Math.round(totalPrice/25000)} onSuccess={handleAddOrderPaypal}/>
              ) : (
                <Button type="primary" block className="bg-blue-500 text-white" style={{ marginTop: 10}} size="large" onClick={handleAddOrder}>
                  Đặt hàng
                </Button>
              )}
            </Card>
          </Col>
        </Row>
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
          </LoadingComponent>
        </ModalComponent>
      </LoadingComponent>
    </>
  );
};

export default PaymentPage;