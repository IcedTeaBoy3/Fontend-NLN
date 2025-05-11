import styled from "styled-components";
import { FacebookLoginButton } from "react-social-login-buttons";

export const CustomFacebookLogin = styled(FacebookLoginButton)`
  height: 40px !important;
  border-radius: 20px !important;
  margin: 0 !important;
  font-size: 12px;
  width: 100% !important;
  
  & > div > div {
    text-align: center !important;
    font-size: 14px !important;
    color: white;
  }
`;