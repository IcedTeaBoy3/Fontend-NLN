
import { WarpperContainerLeft, WarpperContainerRight, WarpperTextLight, WarpperTextRight, WarpperTextRightBottom } from './style'
import { ShoppingCartOutlined,EyeInvisibleOutlined,EyeOutlined } from '@ant-design/icons'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imageLogin from '../../assets/images/login.png'
import {Image} from 'antd'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useMutationHook } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import * as Message from '../../components/Message/Message'
import { useEffect } from 'react'
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import * as jwt_decode from "jwt-decode";
import {useDispatch} from 'react-redux'
import { updateUser } from '../../redux/Slides/userSlide'
import { useLocation } from 'react-router-dom'
// import { FacebookLogin } from '@react-oauth/facebook';
const SignInPage = () => {
  const [isShowPassword,setIsShowPassword] = useState(false)
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const dispatch = useDispatch()
  const location = useLocation()
  const mutation = useMutationHook(data => UserService.loginUser(data))
  const { data, isPending} = mutation
  // Xử lý đăng nhập google
  const handleSuccess = async (response) => {
    const token = response.credential;
    const res = await UserService.loginUserGoogle(token)
    if(res?.status === 'success'){
      dispatch(updateUser({...res?.data,access_token:res?.access_token,refresh_token:res?.refresh_token}))
      localStorage.setItem("access_token", JSON.stringify(res?.access_token))
      localStorage.setItem("refresh_token", JSON.stringify(res?.refresh_token))
      Message.success("Đăng nhập thành công")
      if(location?.state){
        navigate(location?.state)
      }
      navigate("/")
    }else if(res?.status === 'error'){
      Message.error("Đăng nhập thất bại")
    }
  };
  
  const handleFailure = () => {
    Message.error("Đăng nhập thất bại")
  };


  const navigate = useNavigate()
  useEffect(() => {
    if (data?.status === "success") {
      if(location?.state){
        navigate(location?.state)
      }else{
        navigate("/")
      }
      Message.success("Đăng nhập thành công")
      localStorage.setItem("access_token", JSON.stringify(data?.access_token))
      localStorage.setItem("refresh_token", JSON.stringify(data?.refresh_token))
      if (data?.access_token) {
        const decode = jwt_decode.jwtDecode(data?.access_token) // Truy cập qua `.default`
        if (decode?.id) {
          getDetailUser(decode?.id,data?.access_token)
        }
      }
    } else if (data?.status === "error") {
      Message.error("Đăng nhập thất bại")
    }
  }, [data]);

  const getDetailUser = async (id,token) => {
    const storage = localStorage.getItem("refresh_token")
    const refresh_token = JSON.parse(storage)
    const res = await UserService.getUser(id,token)
    dispatch(updateUser({...res?.data,access_token:token,refresh_token:refresh_token}))
  };


  const handleNavigateRegister = () => {
    navigate('/sign-up')
  }
  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value)
  }
  const handleOnchangePassword = (e) => {
    setPassword(e.target.value)
  }
  const handleSignin = () => {
    mutation.mutate({email,password})
  }
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}>

      <div style={{display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.53)',height:'100vh'}}>
        <div style={{display:'flex',width:'800px',height:'445px',borderRadius:'6px',backgroundColor:'#fff'}}>

          <WarpperContainerLeft>
            <h3 style={{fontSize:'24px',fontWeight:'500'}}>Xin chào</h3> 
            <p>Đăng nhập hoặc tạo tài khoản</p>
            <InputForm 
              style={{marginBottom:'10px',padding:'10px 0px'}} 
              placeholder="abc@gmail.com" 
              value={email}
              onChange={handleOnchangeEmail}
              
              
            />
            <div style={{position:'relative'}}>
              <span style={{
                zIndex:'10',
                position:'absolute',
                top:'12px',
                right:'8px',
                cursor:'pointer'
              }} onClick={() => setIsShowPassword(!isShowPassword)}>
                {
                  isShowPassword ? (<EyeOutlined style={{fontSize:'20px'}} />) : (<EyeInvisibleOutlined style={{fontSize:'20px'}} />)
                }
                
              </span>
              <InputForm style={{padding:'10px 0px'}} placeholder="password" type={ isShowPassword ? 'text':'password'} value={password} onChange={handleOnchangePassword}/>
              {data?.status==='error' && <span style={{color:'red'}}>{data?.message}</span>}
            </div>
            <LoadingComponent isLoading={isPending}>
              <ButtonComponent
                disabled={email === '' || password === ''} 
                onClick={handleSignin}
                size={40} 
                styleButton={{
                  backgroundColor:'rgb(255,57,69)',
                  border:'none',
                  borderRadius:'4px',
                  height:'48px',
                  width:'100%',
                  margin:'26px 0 10px'
                }}
                styleTextButton={{
                  color:'#fff',
                  fontSize:'16px',
                  fontWeight:'500',
                  marginTop:'6px'
                }}
                textbutton={'Đăng nhập'}
                icon={<ShoppingCartOutlined style={{fontSize:'30px',color:'#fff',display:'none'}} />}
              />
            </LoadingComponent>
          <p><WarpperTextLight>Quên mật khẩu?</WarpperTextLight></p>
          <p>Chưa có tài khoản? <WarpperTextLight onClick={handleNavigateRegister}>Tạo tài khoản</WarpperTextLight></p>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleFailure}
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="pill"
            width=""
          />

          </WarpperContainerLeft>
          <WarpperContainerRight>
            <Image src={imageLogin} preview={false} alt='logo login' height={203} width={203}></Image>
            <WarpperTextRight>Mua sắm tại WEB</WarpperTextRight>
            <WarpperTextRightBottom>Siêu ưu đãi mỗi ngày</WarpperTextRightBottom>
          </WarpperContainerRight>
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

export default SignInPage