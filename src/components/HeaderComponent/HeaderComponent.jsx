import { Col, Popover, Badge } from 'antd';
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined,LogoutOutlined,SettingFilled,InfoCircleFilled } from '@ant-design/icons';
import {  useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import * as UserService from '../../services/UserService';
import { resetUser } from '../../redux/Slides/userSlide';
import { searchProduct } from '../../redux/Slides/productSlide';
import * as Message from '../Message/Message';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { debounce } from 'lodash'; // Thêm debounce để tối ưu tìm kiếm
import {
  WarpperHeader,
  WarpperTextHeader,
  WarpperHeaderAccount,
  WarpperTextHeaderSmall,
  WarpperContentPopover
} from './style';
import { resetOrderState } from '../../redux/Slides/orderSlide';

function HeaderComponent({ isHiddenSearch, isHiddenCart }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user, shallowEqual);
  const [loading, setLoading] = useState(false);
  const [isOpenPopup,setIsOpenPopup] = useState(false);

  // Cập nhật userName và avatar từ Redux state
  const userName = user?.name || '';
  const avatar = user?.avatar || '';
  const order = useSelector((state) => state.order, shallowEqual);

  // Xử lý đăng xuất
  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    dispatch(resetUser());
    dispatch(searchProduct(''));
    dispatch(resetOrderState());
    setLoading(false);
    Message.success('Đăng xuất thành công');
  };

  // Điều hướng
  const handleNavigate = (path) => () => navigate(path);
  
  // Tìm kiếm sản phẩm với debounce
  const onSearch = useCallback(
    debounce((e) => {
      dispatch(searchProduct(e.target.value));
    }, 300),
    [dispatch]
  );

  const handleClickNavigate = (type) => {
    if(type === 'profile'){
      navigate('/profile');
    }else if(type === 'admin'){
      navigate('/admin/dashboard');
    }else if(type === 'my-order'){
      navigate('/my-order',{
        state: { 
          id: user._id,
          access_token: user.access_token
        }
      });
    }else{
      handleLogout();
    }
    setIsOpenPopup(false);
  }
  // Nội dung dropdown menu
  const content = useMemo(
    () => (
      <div>
        <WarpperContentPopover onClick={() => handleClickNavigate('profile')}><InfoCircleFilled /> Thông tin người dùng</WarpperContentPopover>
        {user?.isAdmin && <WarpperContentPopover onClick={() => handleClickNavigate('admin')}><SettingFilled />  Quản lý hệ thống</WarpperContentPopover>}
        <WarpperContentPopover onClick={() => handleClickNavigate('my-order')}><InfoCircleFilled /> Đơn hàng của tôi</WarpperContentPopover>
        <WarpperContentPopover onClick={handleLogout}><LogoutOutlined /> Đăng xuất</WarpperContentPopover>

      </div>
    ),[user?.isAdmin]);
  
  return (
    <div style={{ width: '100%', background: 'rgb(26,148,255)', display: 'flex', justifyContent: 'center' }}>
      <WarpperHeader justify="space-between">
        <Col span={5}>
          <WarpperTextHeader 
            
            className="flex justify-center items-center"
            onClick={handleNavigate('/')}
          >
            <img src="/logo.png" alt="logo" style={{ width: '150px', height: '60px' }}   /> 

          </WarpperTextHeader>

          
        </Col>

        {!isHiddenSearch && (
          <Col span={13}>
            <ButtonInputSearch
              size="large"
              textbutton="Tìm kiếm"
              placeholder="Tìm kiếm sản phẩm, thương hiệu, danh mục..."
              onChange={onSearch}
            />
          </Col>
        )}

        <Col span={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
          <LoadingComponent isLoading={loading}>
            <WarpperHeaderAccount>
              {avatar ? (
                <img src={avatar} alt="avatar" style={{ width: '35px', height: '35px', borderRadius: '50%' }} />
              ) : (
                <UserOutlined style={{ fontSize: '30px' }} />
              )}
              {user && user?.access_token ? (
                <Popover content={content} trigger="click" open={isOpenPopup} onOpenChange={(visible) => setIsOpenPopup(visible)}>
                  <div style={{ cursor: 'pointer' }} >{userName || user?.email}</div>
                </Popover>
              ) : (
                <div onClick={handleNavigate('/sign-in')} style={{ cursor: 'pointer' }}>
                  <WarpperTextHeaderSmall>Đăng nhập/Đăng ký</WarpperTextHeaderSmall>
                  <div>
                    <WarpperTextHeaderSmall>Tài khoản </WarpperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WarpperHeaderAccount>
          </LoadingComponent>

          {!isHiddenCart && (
            <WarpperHeaderAccount>
              <div onClick={handleNavigate('/order')} style={{ cursor: 'pointer' }}>
                <Badge count={order.orderItems?.length} size="small">
                  <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                </Badge>
              </div>
              <WarpperTextHeaderSmall>Giỏ hàng</WarpperTextHeaderSmall>
            </WarpperHeaderAccount>
          )}
        </Col>
      </WarpperHeader>
    </div>
  );
}

export default HeaderComponent;
