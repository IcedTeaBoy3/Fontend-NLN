
import ModalComponent from '../ModalComponent/ModalComponent' 
import { WarpperContainerLeft, WarpperContainerRight, WarpperTextLight, WarpperTextRight, WarpperTextRightBottom } from './style'
import { ShoppingCartOutlined,EyeInvisibleOutlined,EyeOutlined } from '@ant-design/icons'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import imageLogin from '../../assets/images/login.png'
import {Image,Form} from 'antd'
import { useState,useEffect } from 'react'
import { useMutationHook } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent'
import * as Message from '../../components/Message/Message'
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";
import {useDispatch} from 'react-redux'
import { updateUser } from '../../redux/Slides/userSlide'
import FacebookLogin from '../FacebookLogin/FacebookLogin'
const ModalAuthentication = ({title,isOpen,handleOk,handleCancel,...rests}) => {

    const [isShowPassword,setIsShowPassword] = useState(false)
    const [isShowConfirmPassword,setIsShowConfirmPassword] = useState(false)
    const [mode,setMode] = useState(false)
    const dispatch = useDispatch()
    const [form] = Form.useForm()
    const email = Form.useWatch('email', form);
    const password = Form.useWatch('password', form);
    const mutation = useMutationHook(data => {
        if(mode){
            return UserService.signupUser(data)
        }
        else{
            return UserService.loginUser(data)
        }
    })
    const { data, isPending } = mutation
    // Xử lý đăng nhập google
    const handleSuccess = async (response) => {
        const token = response.credential;
        const res = await UserService.loginUserGoogle(token)
        if(res?.status === 'success'){
            dispatch(updateUser({...res?.data,access_token:res?.access_token,refresh_token:res?.refresh_token}))
            localStorage.setItem("access_token", JSON.stringify(res?.access_token))
            localStorage.setItem("refresh_token", JSON.stringify(res?.refresh_token))
            Message.success("Đăng nhập thành công")
            handleOk()
            form.resetFields()
        }else if(res?.status === 'error'){
            Message.error(res?.message)
        }
    };
    
    const handleFailure = () => {
        Message.error("Đăng nhập thất bại")
    };
    
    // Xử lý đăng nhập bằng tài khoản
    useEffect(() => {
        if (data?.status === "success") {
            setMode(false)
            Message.success(data?.message)
            if(!mode){
                localStorage.setItem("access_token", JSON.stringify(data?.access_token))
                localStorage.setItem("refresh_token", JSON.stringify(data?.refresh_token))
                if (data?.access_token) {
                    const decode = jwtDecode(data?.access_token) // Truy cập qua `.default`
                    if (decode?.id) {
                        getDetailUser(decode?.id,data?.access_token)
                    }
                }
                handleCancel()
                form.resetFields()
            }
        } else if (data?.status === "error") {
            Message.error(data?.message)
        }
    }, [data]);

    const getDetailUser = async (id,token) => {
        const storage = localStorage.getItem("refresh_token")
        const refresh_token = JSON.parse(storage)
        const res = await UserService.getUser(id,token)
        dispatch(updateUser({...res?.data,access_token:token,refresh_token:refresh_token}))
    };

    const onFinish = (values) => {
        const { email, password, confirmPassword } = values
        if (mode) {
            mutation.mutate({ email, password, confirmPassword })
        } else {
            mutation.mutate({ email, password })
        }
    };

    return (
        <ModalComponent title={title} isOpen={isOpen} onOk={handleOk} onCancel={handleCancel} {...rests}>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}>
                <div style={{display:'flex',borderRadius:'6px',backgroundColor:'#fff'}}>
                    <WarpperContainerLeft>
                    <h3 style={{fontSize:'24px',fontWeight:'bold'}}>Xin chào</h3> 
                    <p>Đăng nhập hoặc tạo tài khoản</p>
                    
                    <Form
                        form={form}
                        name="loginForm"
                        onFinish={onFinish}
                        autoComplete="on"
                        
                    >
                        <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: '* Vui lòng nhập email' },
                            { type: 'email', message: '* Email không hợp lệ' },
                        ]}
                        >
                        <InputForm 
                            style={{padding:'10px'}} 
                            placeholder="abc@gmail.com"  
                        />
                        </Form.Item>
        
                        <Form.Item
                        name="password"
                        
                        rules={[
                            { required: true, message: '* Vui lòng nhập mật khẩu' },
                            { min: 6, message: '* Mật khẩu phải từ 6 ký tự trở lên' },
                            { max: 20, message: '* Mật khẩu không được quá 20 ký tự' },
                            // 1 chữ hoa, 1 chữ thường và 1 số và 1 ký tự đặc biệt
                            { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>,.?/~\\|-]).{6,20}$/, message: '* Mật khẩu cần ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt' },
                            
        
                        ]}
                        >
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
                            <InputForm 
                            style={{padding:'10px'}} 
                            placeholder="Nhập mật khẩu" 
                            type={ isShowPassword ? 'text':'password'} 
                            autoComplete="on"
                            />
                        </div>
                        </Form.Item>
                        {mode && (
                        <Form.Item
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                            {
                                required: true,
                                message: '* Vui lòng xác nhận mật khẩu',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('* Mật khẩu không khớp'));
                                },
                            }),
                            ]}
        
                        >
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
                            <InputForm 
                                style={{padding:'10px'}} 
                                placeholder="Nhập lại mật khẩu" 
                                type={ isShowConfirmPassword ? 'text':'password'}
                            />
                            </div>
                        </Form.Item>
                        )}
                        
        
                        <Form.Item>
                        <LoadingComponent isLoading={isPending}>
                            <ButtonComponent
                                size={40} 
                                htmlType="submit"
                                styleButton={{
                                    backgroundColor:'rgb(255,57,69)',
                                    border:'none',
                                    borderRadius:'4px',
                                    height:'48px',
                                    width:'100%',
                                    margin:'10px 0 0px',
                                }}
                                styleTextButton={{
                                    color:'#fff',
                                    fontSize:'16px',
                                    fontWeight:'500',
                                    marginTop:'6px'
                                }}
                                disabled={!email || !password}
                                textbutton={mode ? 'Đăng ký' : 'Đăng nhập'}
                                icon={<ShoppingCartOutlined style={{fontSize:'30px',color:'#fff',display:'none'}} />}
                            />
                        </LoadingComponent>
                        </Form.Item>
                    </Form>  
                    <WarpperTextLight>{!mode && <p>Quên mật khẩu?</p>}</WarpperTextLight>
                    <p>Chưa có tài khoản? <WarpperTextLight onClick={() => setMode(!mode)}>{mode ? 'Đăng nhập' : 'Tạo tài khoản'}</WarpperTextLight></p>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '10px' }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
                    <p style={{ margin: '0 10px', whiteSpace: 'nowrap', fontWeight:'bold' }}>Hoặc tiếp tục bằng</p>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#ccc' }}></div>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>

                        <FacebookLogin handleOk={handleOk} handleCancel={handleCancel}/>
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={handleFailure}
                            theme="filled_blue"
                            size="large"
                            text="signin_with"
                            shape="pill"
                        />
                    </div>
        
                    </WarpperContainerLeft>
                    <WarpperContainerRight>
                        <Image src={imageLogin} preview={false} alt='logo login' height={203} width={203}></Image>
                        <WarpperTextRight>Mua sắm tại WEB</WarpperTextRight>
                        <WarpperTextRightBottom>Siêu ưu đãi mỗi ngày</WarpperTextRightBottom>
                    </WarpperContainerRight>
                </div>
            </GoogleOAuthProvider>
        </ModalComponent>   

    )
}

export default ModalAuthentication