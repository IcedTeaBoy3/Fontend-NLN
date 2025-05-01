import styled from 'styled-components'
import { Input } from 'antd'
export const WrapperInput = styled(Input)`
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 50;
  outline: none;
  /* background-color: ${props => (props.$isValid ? 'none' : '#f08080')}; */
  background-color: aliceblue;
  &:focus {
    background-color: rgb(232, 240, 255);
    box-shadow: none; /* Loại bỏ shadow mặc định của AntD khi focus */
  }
`;
