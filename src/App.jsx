import { useEffect} from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import React from 'react'
import {isJsonString} from './utils'
import { jwtDecode } from 'jwt-decode'
import {useDispatch,useSelector} from 'react-redux'
import { resetUser, updateUser } from './redux/Slides/userSlide'
import * as UserService from './services/UserService'
import UnauthorizedPage from './pages/UnauthorizedPage/UnauthorizedPage'



function App() {
  
  const dispatch = useDispatch()
  const Fragment = React.Fragment
  const user = useSelector(state => state.user)

 
  const refreshAccessToken = async () => {
    try {
        const storageRefreshToken = localStorage.getItem("refresh_token");
        const refresh_token = JSON.parse(storageRefreshToken);
        const decodeRefreshToken = jwtDecode(refresh_token);
        const currentTime = Date.now() / 1000; // 👈 Thêm dòng này để lấy thời gian hiện tại
        if(decodeRefreshToken?.exp > currentTime){
          const res = await UserService.refreshToken(refresh_token);
          if (res?.access_token) {
            localStorage.setItem("access_token", JSON.stringify(res?.access_token));
            return res?.access_token;
          }
        }else{
          console.error("❌ Refresh tokenhết hạn"); // Debug xem có token không
        }
    } catch (error) {
      console.error("❌ Lỗi refresh token:", error);
    }
    return null;
  };
  UserService.axiosJWT.interceptors.response.use(
    response => response, 
    async (error) => {
        const originalRequest = error.config;;
        if (error.response.status === 403 && error.response.message === "Token expired") {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            // Cập nhật token mới vào headers của request cũ
            originalRequest.headers['token'] = `Bearer ${newAccessToken}`;
            // Gửi lại request cũ với token mới
            return UserService.axiosJWT(originalRequest);
          } else {
            dispatch(resetUser()); // Xóa thông tin user nếu refresh token thất bại
          }
        }
      return Promise.reject(error);
    }
  );
  
  
  useEffect(() => {
    const { decode, storageData } = handleDecoded();
    if (decode?.id) {
      handleUpdateUser(decode.id, storageData);
    }
  });
  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decode = {}
    if(storageData && isJsonString(storageData)){
      storageData = JSON.parse(storageData)
      decode = jwtDecode(storageData)
    }
    
    return {decode,storageData}
  }
  const handleUpdateUser = async (id, token) => {
    try {
      const storageRefreshToken = localStorage.getItem("refresh_token");
      if (!storageRefreshToken) {
        console.error("Không tìm thấy refresh_token");
        return;
      }
  
      const refresh_token = JSON.parse(storageRefreshToken);
      
      // Gửi request kèm token
      const res = await UserService.getUser(id, token);
      if (res?.data) {
        dispatch(updateUser({
          ...res.data,
          access_token: token,
          refresh_token: refresh_token,
        }));
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật user:", error);
    }
  };
  return (
    <div>



      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const Layout = route.isShowHeader ? DefaultComponent : Fragment;
            // Kiểm tra quyền truy cập
            const isCheckAuth = route.isPrivate && !user?.isAdmin;
            
            return (
              
              <Route
                key={route.path}
                path={route.path}
                element={
                  isCheckAuth ? <UnauthorizedPage />: <Layout><Page /></Layout> 
                }
              />
            );
          })}
        </Routes>
      </Router>

    </div>
  )
}

export default App
