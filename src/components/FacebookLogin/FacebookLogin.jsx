import * as UserService from "../../services/UserService";
import * as Message from '../../components/Message/Message'
import { updateUser } from '../../redux/Slides/userSlide'
import {useDispatch} from 'react-redux'
import { CustomFacebookLogin } from "./style";
const FacebookLogin = ({handleOk,handleCancel,...rests}) => {
  const dispatch = useDispatch()
  const handleLogin = () => {
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          window.FB.api("/me", { fields: "name,email,picture" }, async function (userInfo) {
            const newUser = {
              name: userInfo.name,
              email: userInfo.email,
              avatar: userInfo.picture.data.url,
            };

            try {
              const res = await UserService.loginUserFacebook(newUser);
              if(res?.status=='success'){
                dispatch(updateUser({...res?.data,access_token:res?.access_token,refresh_token:res?.refresh_token}))
                localStorage.setItem("access_token", JSON.stringify(res?.access_token))
                localStorage.setItem("refresh_token", JSON.stringify(res?.refresh_token))
                Message.success("Đăng nhập thành công")
                handleOk()
              }else{
                Message.error(res?.message)
              }
            } catch (error) {
              Message.error(error)
            }
          });
        } else {
          Message.error("Người dùng đã hủy đăng nhập Facebook");
        }
      },
      { scope: "public_profile,email" }
    );
  };

  return (
    <CustomFacebookLogin onClick={handleLogin} >
      Đăng nhập bằng Facebook
    </CustomFacebookLogin>
  );
};

export default FacebookLogin;
