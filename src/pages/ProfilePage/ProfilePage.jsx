import { useEffect, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { WarpperHeaderProfile,WarpperContentProfile,WarpperLabel,WarpperInput, WarpperUploadFile } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useMutationHook } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import * as Message from '../../components/Message/Message'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import { updateUser } from '../../redux/Slides/userSlide'
import { Button,Row,Col } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { getBase64 } from '../../utils'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [avatar, setAvatar] = useState('')
  const mutation = useMutationHook((data) => {
    const { _id,access_token,...rests } = data
    return UserService.updateUser(_id,rests,access_token)
  })
  const { data, isPending} = mutation
  
  useEffect(() => {
    setEmail(user?.email)
    setName(user?.name)
    setPhone(user?.phone)
    setAddress(user?.address)
    setCity(user?.city)
    setAvatar(user?.avatar)
  },[user])
  useEffect(() => {
    if(data?.status === 'success'){
      Message.success(data?.message)
      getDetailUser(user?._id,user?.access_token)
    }else if(data?.status === 'error'){
      Message.error('Cập nhật thất bại '+data?.message)
    }
  },[data])
  const getDetailUser = async (id,token) => {
    const res = await UserService.getUser(id,token, { cacheBuster: Date.now() });
    dispatch(updateUser({ ...res.data, access_token: token }));

    
  };
  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value)  
  }
  const handleOnchangeName = (e) => {
    setName(e.target.value)
  }
  const handleOnchangePhone = (e) => {
    setPhone(e.target.value)
  }
  const handleOnchangeAddress = (e) => {
    setAddress(e.target.value)
  }
  const handleOnchangeCity = (e) => {
    setCity(e.target.value)
  }
  const handleOnchangeAvatar = async ({ fileList}) => {
    const file = fileList[0]
    if(!file.url && !file.preview){
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview)
  }
  const handleUpdate = () => {
    mutation.mutate({_id:user._id,name,email,phone,address,city,avatar,access_token:user.access_token})
  }
  return (
    <>
      <div style={{height:'44px',padding: '0 120px',backgroundColor:'rgb(239, 239, 239)',display:'flex',alignItems:'center',borderBottom:'1px solid #ccc'}}>
        <span style={{cursor:'pointer',fontWeight:'bold'}} onClick={() => navigate('/')}>Trang chủ </span>
        / Thông tin người dùng
      </div>
      <div style={{ width:'1270px', margin:'0 auto',height: '500px',padding:'20px 0'}}>
        <LoadingComponent isLoading={isPending}>
          <Row>
            <Col span={6} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
              <img 
                src={avatar} 
                alt="avatar" 
                style={{width: '100%', height: 'auto' }} 
              />
            </Col>
            <Col span={18}>
              <WarpperContentProfile>
                <WarpperInput>
                  <WarpperLabel htmlFor='name'>Name</WarpperLabel>
                  <InputForm style={{width:'300px'}} placeholder="Nhập vào tên" id="name" value={name} onChange={handleOnchangeName}/>
                  <ButtonComponent 
                    onClick = {handleUpdate}
                    size = {40}
                    styleButton = {{
                      width: 'fit-content', 
                      height: '30px', 
                      borderRadius: '4px', 
                      border: '1px solid rgb(26,148,255)',
                    }}
                    textButton = {'Cập nhật'}
                    styleTextButton={{fontSize: '15px', fontWeight: '600', color: 'rgb(26,148,255)'}}
                    
                  ></ButtonComponent>
                </WarpperInput>
                <WarpperInput>
                  <WarpperLabel htmlFor='email'>Email</WarpperLabel>
                  <InputForm style={{width:'300px'}} placeholder="abc@gmail.com" id="email" value={email} onChange={handleOnchangeEmail}/>
                  <ButtonComponent 
                    onClick = {handleUpdate}
                    size = {40}
                    styleButton = {{
                      width: 'fit-content', 
                      height: '30px', 
                      borderRadius: '4px', 
                      border: '1px solid rgb(26,148,255)',
                    }}
                    textButton = {'Cập nhật'}
                    styleTextButton={{fontSize: '15px', fontWeight: '600', color: 'rgb(26,148,255)'}}
                    
                  ></ButtonComponent>
                </WarpperInput>
                <WarpperInput>
                  <WarpperLabel htmlFor='phone'>Phone</WarpperLabel>
                  <InputForm style={{width:'300px'}} placeholder="phone number" id="phone" value={phone} onChange={handleOnchangePhone}/>
                  <ButtonComponent 
                    onClick = {handleUpdate}
                    size = {40}
                    styleButton = {{
                      width: 'fit-content', 
                      height: '30px', 
                      borderRadius: '4px', 
                      border: '1px solid rgb(26,148,255)',
                    }}
                    textButton = {'Cập nhật'}
                    styleTextButton={{fontSize: '15px', fontWeight: '600', color: 'rgb(26,148,255)'}}
                    
                  ></ButtonComponent>
                </WarpperInput>
                <WarpperInput>
                  <WarpperLabel htmlFor='city'>City</WarpperLabel>
                  <InputForm style={{width:'300px'}} placeholder="city" id="city" value={city} onChange={handleOnchangeCity}/>
                  <ButtonComponent 
                    onClick = {handleUpdate}
                    size = {40}
                    styleButton = {{
                      width: 'fit-content', 
                      height: '30px', 
                      borderRadius: '4px', 
                      border: '1px solid rgb(26,148,255)',
                    }}
                    textButton = {'Cập nhật'}
                    styleTextButton={{fontSize: '15px', fontWeight: '600', color: 'rgb(26,148,255)'}}
                    
                  ></ButtonComponent>
                </WarpperInput>
                <WarpperInput>
                  <WarpperLabel htmlFor='address'>Address</WarpperLabel>
                  <InputForm style={{width:'300px'}} placeholder="address" id="address" value={address} onChange={handleOnchangeAddress}/>
                  <ButtonComponent 
                    onClick = {handleUpdate}
                    size = {40}
                    styleButton = {{
                      width: 'fit-content', 
                      height: '30px', 
                      borderRadius: '4px', 
                      border: '1px solid rgb(26,148,255)',
                    }}
                    textButton = {'Cập nhật'}
                    styleTextButton={{fontSize: '15px', fontWeight: '600', color: 'rgb(26,148,255)'}}
                    
                  ></ButtonComponent>
                </WarpperInput>
                <WarpperInput>
                  <WarpperLabel htmlFor='avatar'>Avatar</WarpperLabel>
                  <WarpperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
                    <Button icon={<UploadOutlined />}>Select file</Button>
                  </WarpperUploadFile>
                  { avatar && <img src={avatar} alt="avatar" style={{width:'60px',height:'60px',borderRadius:'50%'}}/>}
                  <ButtonComponent 
                    onClick = {handleUpdate}
                    size = {40}
                    styleButton = {{
                      width: 'fit-content', 
                      height: '30px', 
                      borderRadius: '4px', 
                      border: '1px solid rgb(26,148,255)',
                    }}
                    textButton = {'Cập nhật'}
                    styleTextButton={{fontSize: '15px', fontWeight: '600', color: 'rgb(26,148,255)'}}
                    
                  ></ButtonComponent>
                </WarpperInput>
              </WarpperContentProfile>
            </Col>
          </Row>
        </LoadingComponent>
      </div>
    </>
  )
}

export default ProfilePage