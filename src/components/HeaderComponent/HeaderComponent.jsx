import { Col, Popover, Badge } from 'antd';
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined,LogoutOutlined,SettingFilled,InfoCircleFilled } from '@ant-design/icons';
import {  useState, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import * as UserService from '../../services/UserService';
import { resetUser } from '../../redux/Slides/userSlide';
import { searchProduct } from '../../redux/Slides/productSlide';
import * as Message from '../Message/Message';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { debounce } from 'lodash'; // Thêm debounce để tối ưu tìm kiếm
import ModalAuthentication from '../ModalAuthentication/ModalAuthentication';
import {
  WarpperHeader,
  WarpperTextHeader,
  WarpperHeaderAccount,
  WarpperTextHeaderSmall,
  WarpperContentPopover
} from './style';
import { resetOrderState } from '../../redux/Slides/orderSlide';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { convertPrice } from '../../utils';

function HeaderComponent({ isHiddenSearch, isHiddenCart }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector((state) => state.user, shallowEqual);
  const [isOpenModal, setIsOpenModal] = useState(false)
  const handleOk = () => {
    setIsOpenModal(false);
  };
  const handleCancel = () => setIsOpenModal(false);
  const [loading, setLoading] = useState(false);
  const [isOpenPopupUser,setIsOpenPopupUser] = useState(false);
  const [isOpenPopupCart,setIsOpenPopupCart] = useState(false);

  const handleOpenModal = (e) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click lan truyền lên các phần tử cha
    setIsOpenModal(true);
    
  }

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
          id: user?._id,
          access_token: user?.access_token
        }
      });
    }else{
      handleLogout();
    }
    setIsOpenPopupUser(false);
  }
  // Nội dung dropdown menu
  const content = useMemo(
    () => (
      <>
        <WarpperContentPopover  
          onClick={() => handleClickNavigate('profile')}
          className="hover:bg-gray-200 rounded-md"
        >
          <InfoCircleFilled className="mr-2" />
          Thông tin người dùng
        </WarpperContentPopover>
        {user?.isAdmin && <WarpperContentPopover className="hover:bg-gray-200 rounded-md" $isSelected={location.pathname === '/admin' } onClick={() => handleClickNavigate('admin')}><SettingFilled />  Quản lý hệ thống</WarpperContentPopover>}
        <WarpperContentPopover className="hover:bg-gray-200 rounded-md" onClick={() => handleClickNavigate('my-order')}><InfoCircleFilled /> Đơn hàng của tôi</WarpperContentPopover>
        <WarpperContentPopover className="hover:bg-gray-200 rounded-md" onClick={handleLogout}><LogoutOutlined /> Đăng xuất</WarpperContentPopover>

      </>
    ),[user?.isAdmin]);

  // Nội dung giỏ hàng
  const contentCart = useMemo(
    () => (
      <>
        {order.orderItems?.length > 0 ? (
          <div className='size-[500px] p-4'>
            <p className='text-[#ccc]'>Sản phẩm mới thêm</p>
          
            {
              order.orderItems.map((item) => (
                <div className='flex justify-between gap-6 items-center py-2 hover:bg-gray-200 rounded-lg ' key={item.product} onClick={handleNavigate(`/product-details/${item.product}`)}>
                  <div className='flex items-center gap-2'>
                    <img src={item.image} alt={item.name} style={{ width: '35px', height: '35px', borderRadius: '5px' }} />
                    {item.name}
                  </div>
                  <span className='text-red-500'>{convertPrice(item.price)}</span>
                </div>
                
              ))
            }
            <div className="mt-4 flex justify-end">

              <ButtonComponent 
                textButton="Xem giỏ hàng"
                onClick={handleNavigate('/order')}  
                type="primary"
                styleButton={{ background: 'rgb(26,148,255)', color: '#fff', borderRadius: '5px' }}
                styleTextButton={{ color: '#fff' }}
              />
            </div>
              
          </div>
        ) : (
          <WarpperContentPopover >Giỏ hàng trống</WarpperContentPopover>
        )}
      </>
    ),
    [order.orderItems]
  );
  
  return (
    <div style={{ background: 'rgb(26,148,255)', display: 'flex', justifyContent: 'center' }}>
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

              {user?.access_token ? (
                <Popover
                  content={content}
                
                  open={isOpenPopupUser}
                  onOpenChange={(visible) => setIsOpenPopupUser(visible)}
                >
                  <div style={{ cursor: 'pointer' }}>
                    {userName || user.email}
                  </div>
                </Popover>
              ) : (
                <div onClick={handleOpenModal} style={{ cursor: 'pointer' }}>
                  <WarpperTextHeaderSmall>Đăng nhập/Đăng ký</WarpperTextHeaderSmall>
                  <div>
                    <WarpperTextHeaderSmall>Tài khoản</WarpperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WarpperHeaderAccount>
          </LoadingComponent>

          {!isHiddenCart && (
            <Popover
              content={contentCart}
              open={isOpenPopupCart}
              placement="bottomLeft"
              onOpenChange={(visible) => setIsOpenPopupCart(visible)}
            >

              <WarpperHeaderAccount>
                <div onClick={handleNavigate('/order')} style={{ cursor: 'pointer' }}>
                  <Badge count={order.orderItems?.length} size="small">
                    <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                  </Badge>
                </div>
                <WarpperTextHeaderSmall>Giỏ hàng</WarpperTextHeaderSmall>
              </WarpperHeaderAccount>
            </Popover>
          )}
        </Col>
      </WarpperHeader>
      <ModalAuthentication
        isOpen={isOpenModal}
        handleOk={handleOk}
        handleCancel={handleCancel}
        width={800}
        footer={null}>
      </ModalAuthentication>
    </div>
  );
}

export default HeaderComponent;
