import { Col, Row } from 'antd';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

function FooterComponent() {
  return (
    <div style={{ background: '#1A94FF', color: '#fff', padding: '20px 50px' }}>
      <Row gutter={[16, 16]}>
        {/* Cột 1: Giới thiệu */}
        <Col span={6}>
          <h3>Về chúng tôi</h3>
          <p>WEBECORNOMIC là nền tảng thương mại điện tử hàng đầu, cung cấp các sản phẩm chất lượng với giá cả hợp lý.</p>
        </Col>
        
        {/* Cột 2: Liên kết nhanh */}
        <Col span={6}>
          <h3>Liên kết nhanh</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link to="/about" style={{ color: '#fff' }}>Giới thiệu</Link></li>
            <li><Link to="/contact" style={{ color: '#fff' }}>Liên hệ</Link></li>
            <li><Link to="/policy" style={{ color: '#fff' }}>Chính sách bảo mật</Link></li>
            <li><Link to="/terms" style={{ color: '#fff' }}>Điều khoản sử dụng</Link></li>
          </ul>
        </Col>
        
        {/* Cột 3: Hỗ trợ khách hàng */}
        <Col span={6}>
          <h3>Hỗ trợ khách hàng</h3>
          <p>Email: support@webeconomic.com</p>
          <p>Hotline: 1900 1234</p>
          <p>Thời gian hỗ trợ: 8:00 - 22:00 hàng ngày</p>
        </Col>
        
        {/* Cột 4: Mạng xã hội */}
        <Col span={6}>
          <h3>Kết nối với chúng tôi</h3>
          <div style={{ fontSize: '24px' }}>
            <FacebookOutlined style={{ marginRight: '10px', cursor: 'pointer' }} />
            <TwitterOutlined style={{ marginRight: '10px', cursor: 'pointer' }} />
            <InstagramOutlined style={{ marginRight: '10px', cursor: 'pointer' }} />
            <YoutubeOutlined style={{ cursor: 'pointer' }} />
          </div>
        </Col>
      </Row>
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
        &copy; {new Date().getFullYear()} WEBECORNOMIC. All rights reserved.
      </div>
    </div>
  );
}

export default FooterComponent;
