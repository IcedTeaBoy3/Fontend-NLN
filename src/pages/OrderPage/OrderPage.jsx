import { useEffect, useMemo, useState } from "react";
import { Table, Checkbox, Card, Typography, Row, Col, Image, Form } from "antd";
import { DeleteOutlined} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { removeOrderProduct, updateOrderProduct, removeMultipleOrderProducts, selectedOrder,updatePrice } from "../../redux/Slides/orderSlide";
import { convertPrice } from "../../utils";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";  
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService"; 
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { updateUser } from "../../redux/Slides/userSlide";
import { useNavigate } from "react-router-dom";
import StepComponent from "../../components/StepComponent/StepComponent";
import * as Message from "../../components/Message/Message";
import ModalAuthentication from "../../components/ModalAuthentication/ModalAuthentication";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ProductQuantityControl from "../../components/ProductQuantityControl/ProductQuantityControl";

const { Title, Text } = Typography;

const OrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleOk = () => {
    setIsOpenModal(false);
  };
  const handleCancel = () => setIsOpenModal(false);

  const [isModalUpdateInfo, setIsModalUpdateInfo] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formUpdate] = Form.useForm();
  // Lưu chi tiết một người dùng
  const [stateUserDetail, setStateUserDetail] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    email: ''
  })
  // Gọi API cập nhật người dùng
  const mutationUpdate = useMutationHook((data) => {
    const { id,access_token, ...rests } = data
    return UserService.updateUser(id,rests,access_token)
  })
  const { data: dataUpdate, isPending: loadingUpdate } = mutationUpdate;
  

  useEffect(() => {
    if(dataUpdate?.status === "success"){
      Message.success(dataUpdate?.message);
      setIsModalUpdateInfo(false);
      dispatch(updateUser({
        ...stateUserDetail
      }));
    }else if(dataUpdate?.status === "error"){
      Message.error(dataUpdate?.message); 
    }
  }, [dataUpdate]);

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
    const tempPrice = order.orderItemsSelected.reduce((total, item) => total + item.price * item.amount, 0);
    
    // Tính giảm giá
    const priceDiscount = order.orderItemsSelected.reduce((total, item) => {
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
  

  const isAllSelected = useMemo(() => {
    return order?.orderItems?.length > 0 && selectedProducts.length === order?.orderItems?.length;
  }, [selectedProducts, order?.orderItems]);

  useEffect(() => {
    if (order?.orderItems) {
      const selected = order.orderItems.map(item => item.product);
      setSelectedProducts(selected);
    }
  }, []);

  useEffect(() => {
    dispatch(selectedOrder({selectedProducts}));
  }, [selectedProducts])

  useEffect(() => {
    setSelectedProducts(prev => prev.filter(id => order?.orderItems.some(item => item.product === id)));
  }, [order.orderItems]);


  // Chọn/bỏ chọn sản phẩm
  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Chọn/bỏ chọn tất cả
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(order?.orderItems?.map(item => item.product));
    } else {
      setSelectedProducts([]);
    }
  };






  // Xóa nhiều sản phẩm
  const handleDeleteSelected = () => {
    if (selectedProducts.length === 0) {
      Message.warning("Vui lòng chọn sản phẩm để xóa!");
      return;
    }
    dispatch(removeMultipleOrderProducts(selectedProducts));
    Message.success("Xóa sản phẩm thành công!");
    // Cập nhật lại danh sách `selectedProducts` chỉ giữ sản phẩm chưa bị xóa
    setSelectedProducts(prev =>
      prev.filter(id => order?.orderItems.some(item => item.product === id))
    );
  };
  // Xử lý đặt hàng
  const handleOrderProduct = () => {
    if(!user?.access_token){
      Message.warning("Vui lòng đăng nhập để mua hàng!");
      setIsOpenModal(true);
      return
    }
    if(order?.orderItemsSelected.length == 0){
      Message.warning("Vui lòng chọn sản phẩm để mua!");
    } else if(!user.phone || !user.address || !user.city || !user.name){
      Message.warning("Vui lòng cập nhật thông tin giao hàng!");    
      setIsModalUpdateInfo(true);
    }else{
      dispatch(updatePrice({ itemsPrice: tempPrice, shippingPrice: deliveryPrice, totalPrice }));
      navigate("/payment");
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
    if(!user?.access_token){
      Message.warning("Vui lòng đăng nhập để cập nhật thông tin giao hàng!");
      setIsOpenModal(true);
      return;
    }
    setIsModalUpdateInfo(true);
  }
  const handleIncreaseQuantity = (record) => {
    
    if(record.amount < record.countInStock){
      dispatch(updateOrderProduct({ product: record.product, amount: record.amount + 1 }))
    }else{
      Message.warning("Số lượng không đủ");
    }
    
  }
  const handleDecreaseQuantity = (record) => {
    if(record.amount > 1){
      dispatch(updateOrderProduct({ product: record.product, amount: record.amount - 1 }))
    }else{
      Message.warning("Số lượng không thể nhỏ hơn 1");
    }
  }
  const columns = [
    {
      title: <Checkbox checked={isAllSelected} onChange={(e) => handleSelectAll(e.target.checked)} />,
      dataIndex: "checkbox",
      render: (_, record) => (
        <Checkbox
          checked={selectedProducts.includes(record.product)}
          onChange={() => handleSelectProduct(record.product)}
        />
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "product",
      render: (_, record) => (
        <Row gutter={10} align="middle">
          <Col>
            <Image width={60} src={record.image} />
          </Col>
          <Col>
            <Text>{record.name}</Text>
          </Col>
        </Row>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      render: (_, record) => (
        <>
          <Text delete>{convertPrice(record.price)} </Text>
        </>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      render: (_, record) => (
        
        <ProductQuantityControl
          value={record.amount}
          min={1}
          max={record.countInStock}
          onIncrease={() => handleIncreaseQuantity(record)}
          onDecrease={() => handleDecreaseQuantity(record)}
        />
        
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      render: (_, record) => <Text type="danger">{convertPrice(record.price * record.amount * (1-record.discount/100))}</Text>,
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: (_, record) => (
        <ButtonComponent
          type="text"
          icon={<DeleteOutlined style={{fontSize:'20px'}}/>}
          styleButton={{padding:'0px 0px 8px 8px'}}
          danger
          onClick={() => dispatch(removeOrderProduct(record.product))}
        ></ButtonComponent>
      ),
    },
  ];
  const items = [
    {
      title: "30.000 VNĐ",
      description: "Từ 0 đến 2tr",
    },
    {
      title: "20.000 VNĐ",
      description: "Từ 2tr đến 5tr",
    },
    {
      title: "0 VNĐ",
      description: "Lớn hơn 5tr",
    },
  ]
  const currentStep = useMemo(() => {
    if (deliveryPrice === 0) return 2;
    if (deliveryPrice === 20_000) return 1;
    return 0;
  }, [deliveryPrice]);
  
  return (
    <>
      <div style={{height:'44px',padding: '0 120px',backgroundColor:'rgb(239, 239, 239)',display:'flex',alignItems:'center',borderBottom:'1px solid #ccc'}}>
        <span style={{cursor:'pointer',fontWeight:'bold'}} onClick={() => navigate('/')}>Trang chủ </span>
        / Giỏ hàng
      </div>
      <div style={{ padding: "20px 110px", backgroundColor: "rgb(239, 239, 239)" }}>

        <Row justify="space-between" gutter={20}> 
          <Col span={16}>
            <Title level={4} className="mt-2">Giỏ hàng</Title>
            <Card style={{ marginBottom: 20 }}>

              <StepComponent current={currentStep} items={items}/>
            </Card>
            <ButtonComponent
              type="primary"
              size="medium"
              textButton="Xoá tất cả"
              icon={<DeleteOutlined style={{fontSize:'20px'}}/>}
              disabled={selectedProducts.length == 0}
              onClick={handleDeleteSelected}
              styleButton={{ marginBottom: "10px", backgroundColor: 'red' }}
            >

            </ButtonComponent>
            <Table columns={columns} dataSource={order?.orderItems} pagination={true} rowKey="product" />
          </Col>
          <Col span={8}>
            <Card>
              <span style={{fontWeight:'bold'}}>Địa chỉ: </span>
              <Title level={5}>{user?.address} - {user?.city}</Title>
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
              <ButtonComponent 
                type="primary" 
                size="large" 
                block 
                styleButton={{ marginTop: 10,fontWeight:'bold' }} 
                onClick={handleOrderProduct} 
                disabled={order?.orderItemsSelected.length == 0}
                textButton="Mua hàng"
              >
              </ButtonComponent>
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
          </LoadingComponent>
        </ModalComponent>
        <ModalAuthentication
          isOpen={isOpenModal}
          handleOk={handleOk}
          handleCancel={handleCancel}
          width={800}
          footer={null}>
        </ModalAuthentication>
      </div>
    </>
  );
};

export default OrderPage;