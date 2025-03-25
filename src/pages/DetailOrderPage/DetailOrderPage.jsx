
import { useParams, useNavigate } from 'react-router-dom'
import * as OrderService from '../../services/OrderService';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import { Row,Col,Typography,Card,Tag,Table } from 'antd';
import { orderConstant } from "../../../constant";
import { convertPrice } from '../../utils';
const { Title } = Typography;

const DetailOrderPage = () => {
    const params = useParams();
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const fetchDetailOrder = async () => { 
        try {
            const res = await OrderService.getDetailOrder(params.id, user?.access_token);
            return res.data;
        } catch (error) {
            // console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
            return [];
        }
    };
    const { isLoading, data: order } = useQuery({
        queryKey: ['order', params.id],
        queryFn: fetchDetailOrder,
        enabled: !!params.id && !!user?.access_token, // Chỉ chạy khi có user
    });
    // const {paymentMethod, orderItems, isDelivered, isPaid, shippingPrice, totalPrice } = order;
    const orderItems = order?.orderItems;
    
    return (
        <>
        
            <div style={{height:'44px',padding: '0 120px',backgroundColor:'rgb(239, 239, 239)',display:'flex',alignItems:'center',borderBottom:'1px solid #ccc'}}>
                <span style={{cursor:'pointer',fontWeight:'bold'}} onClick={() => navigate('/')}>Trang chủ </span>
                <span style={{cursor:'pointer',fontWeight:'bold'}} onClick={() => navigate('/my-order',{
                    state: {
                        id: user._id,
                        access_token: user.access_token
                    }
                })}>/ Đơn hàng của bạn</span>
                / Chi tiết đơn hàng
            </div>
             {/* Nội dung */}
            <LoadingComponent isLoading={isLoading}>
                <div style={{backgroundColor: '#f0f2f5'}}>

                    <div style={{width:'1270px',margin:'0 auto',padding:'20px 0'}}>
                        <Title level={3} style={{ textAlign: 'center', color: '#1890ff' }}>Chi tiết đơn hàng</Title>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.1)', transition: 'all 0.3s ease-in-out'}}>
                                    <Title level={5}>📍 Địa chỉ nhận hàng</Title>
                                    <p><strong>Họ tên:</strong> {order?.shippingAddress?.fullName}</p>
                                    <p><strong>Địa chỉ:</strong> {order?.shippingAddress?.address}, {order?.shippingAddress?.city}</p>
                                    <p><strong>Điện thoại:</strong> {order?.shippingAddress?.phone}</p>
                                </Card>
                            </Col>

                            {/* Hình thức giao hàng */}
                            <Col span={8} >
                                <Card style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.1)', transition: 'all 0.3s ease-in-out'}}>
                                    <Title level={5}>🚚 Hình thức giao hàng</Title>
                                    <p><strong>Hình thức:</strong> {orderConstant.shippingMethod[order?.shippingMethod]}</p>
                                    <p><strong>Phí vận chuyển:</strong> {convertPrice(order?.shippingPrice)}</p>
                                    <p><strong>Trạng thái: </strong> 
                                        {order?.isDelivered 
                                        ? <Tag color="green"> Đã giao</Tag> 
                                        : <Tag color="red"> Chưa giao</Tag>}
                                    </p>
                                </Card>
                            </Col>

                            {/* Hình thức thanh toán */}
                            <Col span={8}>
                                <Card style={{ boxShadow: '0 4px 10px rgba(0,0,0,0.1)', transition: 'all 0.3s ease-in-out'}}>
                                    <Title level={5}>💳 Thanh toán</Title>
                                    <p><strong>Phương thức:</strong> {orderConstant.paymentMethod[order?.paymentMethod]}</p>
                                    <p><strong>Trạng thái: </strong> 
                                        {order?.isPaid 
                                        ? <Tag color="green">Đã thanh toán</Tag> 
                                        : <Tag color="red">Chưa thanh toán</Tag>}
                                    </p>
                                </Card>
                            </Col>
                        </Row>

                        {/* Danh sách sản phẩm */}
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={24}>
                                <Card>
                                    <Title level={5}>🛒 Danh sách sản phẩm</Title>
                                    <Table
                                        dataSource={orderItems}
                                        pagination={false}
                                        bordered
                                        rowKey="_id"
                                        columns={[
                                            {
                                                title: 'Sản phẩm',
                                                dataIndex: 'image',
                                                key: 'image',
                                                render: (img, record) => (
                                                    <img src={img} alt={record.name} style={{ width: 50, height: 50, borderRadius: '5px' }} />
                                                ),
                                            },
                                            {
                                                title: 'Tên sản phẩm',
                                                dataIndex: 'name',
                                                key: 'name',
                                                align: 'center',
                                            },
                                            {
                                                title: 'Số lượng',
                                                dataIndex: 'amount',
                                                key: 'amount',
                                                align: 'center',
                                            },
                                            {
                                                title: 'Giá',
                                                dataIndex: 'price',
                                                key: 'price',
                                                align: 'center',
                                                render: (price) => convertPrice(price),
                                                
                                            },
                                            {
                                                title: 'Giảm giá',
                                                dataIndex: 'discount',
                                                key: 'discount',
                                                align: 'center',
                                                render: (discount,record) => convertPrice(record.price * record.amount * discount / 100),
                                            }
                                        ]}
                                    />
                                </Card>
                            </Col>
                        </Row>

                        {/* Tổng tiền */}
                        <Row justify="end" style={{ marginTop: '20px' }}>
                            <Col span={8}>
                                <Card style={{ backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
                                    <Title level={5}>💰 Tổng thanh toán</Title>
                                    <p><strong>Phí vận chuyển:</strong> {convertPrice(order?.shippingPrice)}</p>
                                    <p><strong>Tổng tiền:</strong> <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff4d4f' }}>{convertPrice(order?.totalPrice)} đ</span></p>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </LoadingComponent>

        </>

    )
}

export default DetailOrderPage