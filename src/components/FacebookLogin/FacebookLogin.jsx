
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons"; // Tuỳ chọn UI
const FacebookLogin = () => {
    const handleLogin = ({ provider, data }) => {
        console.log("Login success:", provider, data);
    
        
      };
    const handleError = (error) => {
        console.error("Login Failed: ", error);
        // Xử lý lỗi khi đăng nhập không thành công
    }
    return (
        <LoginSocialFacebook

            appId={import.meta.env.VITE_APP_FACEBOOK_CLIENT_ID}
            onResolve={handleLogin}
            onReject={handleError}
        >
            <FacebookLoginButton  onClick={() => console.log("Click nút Facebook")}/>
        </LoginSocialFacebook>
    )
}

export default FacebookLogin