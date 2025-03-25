import styled from "styled-components";
import { Modal } from "antd";

export const CustomModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 0 ;
  }
  .ant-modal-header {
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  .ant-modal-footer {
    padding-top: 10px;
    border-top: 1px solid #eee;
  }
`;