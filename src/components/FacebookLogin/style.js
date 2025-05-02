import styled from "styled-components";
import { FacebookLoginButton } from "react-social-login-buttons";

export const CustomFacebookLogin = styled(FacebookLoginButton)`
  height: 40px !important;
  border-radius: 20px !important;
  margin: 0;
  padding: 0 16px;
  font-size: 12px;

  & > div {
    font-size: 12px;
    font-weight: 500;
    color: white;
  }
`;