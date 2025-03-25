import styled from 'styled-components';
import { Upload } from 'antd';
export const WarpperHeader = styled.h1`
  
  /* color: #000; */
  font-size: 20px;
  font-weight: bold;
  // Viết hoa chữ cái đầu tiên của mỗi từ
  text-transform: capitalize;
`;
export const WarpperUploadFile = styled(Upload) `
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
    & .ant-upload-list.ant-upload-list-text {
        display: none;
    }
`