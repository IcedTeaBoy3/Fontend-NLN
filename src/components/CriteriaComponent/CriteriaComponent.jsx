import { Col, Row, Card } from 'antd';
import { CheckCircleOutlined,TruckOutlined,DollarOutlined,CustomerServiceFilled } from '@ant-design/icons';

const criteria = [
  { title: 'Chất lượng đảm bảo', description: 'Sản phẩm chất lượng cao, chính hãng.', icon: <CheckCircleOutlined /> },
  { title: 'Giá cả hợp lý', description: 'Mức giá cạnh tranh trên thị trường.', icon: <DollarOutlined /> },
  { title: 'Dịch vụ tận tâm', description: 'Hỗ trợ khách hàng 24/7.', icon: <CustomerServiceFilled /> },
  { title: 'Giao hàng nhanh', description: 'Vận chuyển nhanh chóng, tiện lợi.', icon: <TruckOutlined /> },
];

function CriteriaComponent() {
  return (
    <div style={{ padding: '20px 20px', textAlign: 'center' }}>
      <Row gutter={[16, 16]} justify="center">
        {criteria.map((item, index) => (
          <Col key={index} xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', color: '#1A94FF' }}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default CriteriaComponent;
