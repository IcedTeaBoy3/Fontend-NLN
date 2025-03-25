import { useEffect } from 'react'
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
import * as Message from '../../components/Message/Message'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'

const SignUpPage = () => {
  const [isShowPassword,setIsShowPassword] = useState(false)
  const [isShowConfirmPassword,setIsShowConfirmPassword] = useState(false)
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('')
  const naviagte = useNavigate()
  const mutation = useMutationHook(data => UserService.signupUser(data))
  const { data, isPending } = mutation


  useEffect(() => {
    if(data?.status==='success'){
      Message.success('Đăng ký thành công')
      handleNavigateSignin()
    }
    else if(data?.status==='error'){
      Message.error('Đăng ký thất bại')
    }
  },[data])

  const handleNavigateSignin = () => {
    naviagte('/sign-in')
  }
  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value)
  }
  const handleOnchangePassword = (e) => {
    setPassword(e.target.value)
  }
  const handleOnchangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value)
  }
  const handleSignup = () => {
    mutation.mutate({email,password,confirmPassword})
  }
  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.53)',height:'100vh'}}>
      <div style={{display:'flex',width:'800px',height:'445px',borderRadius:'6px',backgroundColor:'#fff'}}>
        <WarpperContainerLeft>
          <h3 style={{fontSize:'24px',fontWeight:'500'}}>Xin chào</h3> 
          <p>Đăng nhập hoặc tạo tài khoản</p>
          <InputForm style={{marginBottom:'10px',padding:'10px 0px'}} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail}/>
          <div style={{position:'relative'}}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)} 
              style={{
                zIndex:'10',
                position:'absolute',
                top:'12px',
                right:'8px',
              }}>
              {
                isShowPassword ? (<EyeOutlined style={{fontSize:'20px'}} />) : (<EyeInvisibleOutlined style={{fontSize:'20px'}} />)
              }
            </span>
            <InputForm style={{padding:'10px 0px'}} placeholder="password" type={ isShowPassword ? 'text':'password'} value={password} onChange={handleOnchangePassword}/>
          </div>
          <div style={{position:'relative'}}>
            <span style={{
              zIndex:'10',
              position:'absolute',
              top:'12px',
              right:'8px',

            }} onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}>
              {
                isShowConfirmPassword ? (<EyeOutlined style={{fontSize:'20px'}} />) : (<EyeInvisibleOutlined style={{fontSize:'20px'}} />)
              }
              
            </span>
            <InputForm style={{padding:'10px 0px'}} placeholder="confirm password" type={ isShowConfirmPassword ? 'text':'password'} value={confirmPassword} onChange={handleOnchangeConfirmPassword}/>
          </div>
          {data?.status==='error' && <span style={{color:'red'}}>{data?.message}</span>}
          <LoadingComponent isLoading={isPending}>
            <ButtonComponent
              disabled={email === '' || password === '' || confirmPassword === ''}
              onClick={handleSignup}
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
              textbutton={'Đăng ký'}
              icon={<ShoppingCartOutlined style={{fontSize:'30px',color:'#fff',display:'none'}} />}
            />
          </LoadingComponent>
        <p>Bạn đã có tài khoản? <WarpperTextLight onClick={handleNavigateSignin}>Đăng nhập</WarpperTextLight></p>
        </WarpperContainerLeft>
        <WarpperContainerRight>
          <Image src={imageLogin} preview={false} alt='logo login' height={203} width={203}></Image>
          <WarpperTextRight>Mua sắm tại WEB</WarpperTextRight>
          <WarpperTextRightBottom>Siêu ưu đãi mỗi ngày</WarpperTextRightBottom>
        </WarpperContainerRight>
      </div>
    </div>
  )
}

export default SignUpPage