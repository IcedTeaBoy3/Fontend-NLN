
import { Row, Tag } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import * as OrderService from '../../services/OrderService';
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import { Card, Col } from 'antd';
import { useMutationHook } from '../../hooks/useMutationHook';
import * as Message from '../../components/Message/Message';
import { Image, Typography, Button } from 'antd';
import { useEffect } from 'react';
const { Text } = Typography;

const MyOrderPage = () => {
    const location = useLocation();
    const { state } = location;
    const user = useSelector((state) => state.user);
    
    const navigate = useNavigate();
    
    const fetchMyOrder = async () => {
        if (!state?.id || !state?.access_token){
            console.error('Không có user');
            return [];
        }
        try {
            const res = await OrderService.getAllOrder(state.id, state.access_token);
            return res.data;
        } catch (error) {
            console.error('Lỗi khi lấy đơn hàng:', error);
            return [];
        }
    };

    const queryOrder = useQuery({
        queryKey: ['order', state?.id],
        queryFn: fetchMyOrder,
        enabled: !!state?.id && !!state?.access_token, // Chỉ chạy khi có user
    });
    const { isLoading, data: orders } = queryOrder;

    const mutation = useMutationHook(
        (data) => {
            const { id, access_token } = data;
            return OrderService.cancelOrder(id, access_token);
        }
    );

    const handleCancelOrder = async (orderId) => {
        mutation.mutate({ id: orderId, access_token: state.access_token },{
            onSuccess: () => {
                queryOrder.refetch()
            }
        });

    }
    const { isPending,data:dataCancel } = mutation;
    useEffect(() => {
        if(dataCancel?.status === 'success'){
            Message.success('Hủy đơn hàng thành công');
        }else if(dataCancel?.status === 'error'){
            Message.error('Hủy đơn hàng thất bại');
        }
    },[dataCancel])
    

    const handleDetailOrder = (orderId) => {
        navigate(`/detail-order/${orderId}`);
    }

    return (
        <>
            <div style={{height:'44px',padding: '0 120px',backgroundColor:'rgb(239, 239, 239)',display:'flex',alignItems:'center',borderBottom:'1px solid #ccc'}}>
                <span style={{cursor:'pointer',fontWeight:'bold'}} onClick={() => navigate('/')}>Trang chủ </span>
                / Đơn hàng của bạn
            </div>
            <LoadingComponent isLoading={isLoading}>
                <div style={{width:'1270px',margin:'0 auto',padding:'20px 0'}}>
                    {orders && orders.length > 0 ? (
                        orders.map((order) => (
                            <Card key={order._id} style={{ marginBottom: 20, borderRadius: 8, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', transition: 'all 0.3s ease-in-out'}} > 
                                {/* Trạng thái đơn hàng */}
                                <Row justify="space-between" style={{ marginBottom: 10 }}>
                                    <Col>
                                        <Text strong style={{ fontSize: 16 }}>Trạng thái</Text>
                                        <div>
                                            <Text type="danger">Giao hàng: </Text> 
                                            {order?.isDelivery 
                                            ? <Tag color="green">Đã giao hàng</Tag> 
                                            : <Tag color="red">Chưa giao hàng</Tag>}
                                        </div>
                                        <div>
                                            <Text type="danger">Thanh toán: </Text> 
                                            {order?.isPaid 
                                            ? <Tag color="green">Đã thanh toán</Tag> 
                                            : <Tag color="red">Chưa thanh toán</Tag>}
                                        </div>
                                    </Col>
                                </Row>

                                {/* Danh sách sản phẩm */}
                                {order?.orderItems?.map((item) => (
                                    <Row key={item._id} align="middle" style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                                        <Col span={4}>
                                            <Image src={item.image} width={50} height={50} style={{ borderRadius: 5 }} />
                                        </Col>
                                        <Col span={16}>
                                            <Text>{item.name}</Text>
                                        </Col>
                                        <Col span={4} style={{ textAlign: 'right' }}>
                                            <Text strong>{convertPrice(item.price)}</Text>
                                        </Col>
                                    </Row>
                                ))}

                                {/* Tổng tiền & Nút bấm */}
                                <Row justify="space-between" align="middle" style={{ marginTop: 10 }}>
                                    <Col>
                                        <Text strong style={{ fontSize: 16, color: 'red' }}>
                                            Tổng tiền: {convertPrice(order.totalPrice)}
                                        </Text>
                                    </Col>
                                    <Col>
                                        <Button danger style={{ marginRight: 10 }} onClick={() => handleCancelOrder(order?._id)}>Hủy đơn hàng</Button>
                                        <Button type="primary"  onClick={() => handleDetailOrder(order._id)}>Xem chi tiết</Button>
                                    </Col>
                                </Row>
                            </Card>
                        ))
                    ) : (
                        <p>Không có đơn hàng nào.</p>
                    )}  
                </div>
            </LoadingComponent>
            
        
        </>
    );
};

export default MyOrderPage;