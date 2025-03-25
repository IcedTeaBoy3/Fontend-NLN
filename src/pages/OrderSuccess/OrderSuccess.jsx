
import {  Card, Typography, Row, Col, List,Image} from "antd";
import { useSelector } from "react-redux";

import { CheckCircleOutlined, CreditCardOutlined,ShoppingCartOutlined } from "@ant-design/icons";

import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { orderConstant } from "../../../constant";

const { Title, Text } = Typography;

const OrderSuccess = () => {

  const navigate = useNavigate();
  const order = useSelector((state) => state.order);
  const location = useLocation()
  const { state } = location

  return (
    <>
      <div style={{height:'44px',padding: '0 120px',backgroundColor:'rgb(239, 239, 239)',display:'flex',alignItems:'center',borderBottom:'1px solid #ccc'}}>
        <span style={{cursor:'pointer',fontWeight:'bold'}} onClick={() => navigate('/')}>Trang chủ </span>
        <span style={{cursor:'pointer',fontWeight:'bold'}} onClick={() => navigate('/order')}>/ Giỏ hàng </span>
        / Thanh toán
      </div>
      <LoadingComponent isLoading={false}>
        <Row
            gutter={16}
            style={{
                width: "1270px",
                margin: "0 auto",
            }}
            >
            <Col span={24}>
                <Title level={4} style={{ textAlign: "center", color: "#1890ff" }}>
                Đơn hàng đã đặt thành công
                </Title>

                <Card
                    className="mb-4"
                    style={{
                        borderRadius: "10px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        border: "1px solid #ddd",
                    }}
                    >
                    <h3 className="font-medium mb-2">
                        <CheckCircleOutlined style={{ color: "green", marginRight: "8px" }} />
                        Phương thức giao hàng
                    </h3>
                    <Text strong className="text-yellow-600">{orderConstant.shippingMethod[state?.shippingMethod]}</Text> Giao hàng tiết kiệm
                </Card>

                <Card
                    style={{
                        borderRadius: "10px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        border: "1px solid #ddd",
                    }}
                    >
                    <h3 className="font-medium mb-2">
                        <CreditCardOutlined style={{ color: "#1890ff", marginRight: "8px" }} />
                        Phương thức thanh toán
                    </h3>
                    <Text>{orderConstant.paymentMethod[state?.paymentMethod]}</Text>
                </Card>

                 {/* Danh sách đơn hàng */}
                <Card
                    style={{
                        borderRadius: "10px",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                        border: "1px solid #ddd",
                        marginBottom: "16px",
                    }}
                    >
                    <h3 className="font-medium mb-2">
                        <ShoppingCartOutlined style={{ color: "#faad14", marginRight: "8px" }} />
                        Thông tin đơn hàng
                    </h3>
                    <List
                        dataSource={state?.orders}
                        renderItem={(order, index) => (
                        <List.Item style={{ display: "flex", alignItems: "center", gap: "16px", padding: "12px 0" }}>
                            {/* Hình ảnh sản phẩm */}
                            <Image preview={false} src={order.image} width={100} style={{ borderRadius: "8px", border: "1px solid #ddd" }} />
                            
                            {/* Thông tin sản phẩm */}
                            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                <Text strong style={{ fontSize: "16px", color: "#333" }}>{order.name}</Text>
                                <Text style={{ fontSize: "14px", color: "#888" }}>Giá tiền: <Text strong style={{ color: "#ff4d4f" }}>{order.price}₫</Text></Text>
                                <Text style={{ fontSize: "14px", color: "#888" }}>Số lượng: <Text strong>{order.amount}</Text></Text>
                            </div>
                        </List.Item>
                        
                        )}
                    />

                    <div>
                        <Text style={{ fontSize: "16px", color: "#333" }}>Tổng tiền: <Text strong style={{ color: "#ff4d4f" }}>{state?.totalPrice}₫</Text></Text>
                    </div>
                </Card>
            </Col>
        </Row>

       
      </LoadingComponent>
    </>
  );
};

export default OrderSuccess;