import styled from 'styled-components';
import { InputNumber } from 'antd';
export const WarpperQuantityProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    width: 120px;
    border: 1px solid #ccc;
    border-radius: 4px;
`

export const WarpperInputNumber = styled(InputNumber)`

    & .ant-input-number-input{
        width: 50px;
        border-top: none;
        border-bottom: none;
    }
    /* Ẩn nút tăng/giảm trên Chrome, Safari */
    .ant-input-number-handler-wrap {
        display: none !important;
    }

    
`