// import React from 'react'
import { Menu } from 'antd';
import { useState } from 'react';
import { UserOutlined, AppstoreOutlined, SettingOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import DashboardUser from '../../components/DashboardUser/DashboardUser';
import DashboardProduct from '../../components/DashboardProduct/DashboardProduct';
import DashboardOrder from '../../components/DashboardOrder/DashboardOrder';
import DashboardStatistic from '../../components/DashboardStatistic/DashboardStatistic';
const AdminPage = () => {
  const items = [
    {
      key: 'user',
      label: 'Người dùng',
      icon: <UserOutlined />,
    },
    {
      key: 'product',
      label: 'Sản phẩm',
      icon: <AppstoreOutlined />,
     
    },
    {
      key: 'order',
      label: 'Đơn hàng',
      icon: <ShoppingCartOutlined />,
    },
    {
      key: 'statistic',
      label: 'Thống kê',
      icon: <SettingOutlined />,
    },
  ];
  const [key, setKey] = useState('');
  const onClick = (e) => {
    setKey(e.key);
  };
  const renderPage = (key) => {
    switch (key) {
      case 'user':
        return <DashboardUser />;
      case 'product':
        return <DashboardProduct />;
      case 'order':
        return <DashboardOrder />;
      case 'statistic':
        return <DashboardStatistic />;
      default:
        return <></>;
    }
  }
  return (
    <>
      <HeaderComponent isHiddenSearch={true} isHiddenCart={true}/>
      <div style={{ display: 'flex', backgroundColor: '#f0f2f5' }}>

        <Menu
          onClick={onClick}
          style={{
            width: 256,
            boxShadow: '0 0 10px 0 rgba(0,0,0,0.1)',
            height: '100vh', // 🔥 Chiều cao bằng 100% viewport
            overflowY: 'auto', // 🔥 Nếu nội dung quá dài, cho phép cuộn
          }}
          selectedKeys={[key]}
          mode="inline"
          items={items}
        />
        <div style={{ flex: 1, padding: '20px' }}>
          {renderPage(key)}
        </div>
      </div>
    </>
  )
}

export default AdminPage