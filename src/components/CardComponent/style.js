import styled from "styled-components";
import { Card } from 'antd'
export const WarpperCardStyle = styled(Card)`
    & img {
        width: 200px;
        height: 200px;
    }
    position: relative;
    background-color: ${props => props.disable ? '#ccc' : 'white'};
    cursor: ${props => props.disable ? 'not-allowed' : 'pointer'};
`

export const StyledNameProduct = styled.div`
    /* font-size: 14px; */
    font-size:  14px;
    // thêm khoảng các giữa các dong chữ
    line-height: 16px;
    color: rgb(56,56,61);
`;

export const WarpperReportText = styled.div`
    font-size: 12px;
    color: rgb(128,128,137);
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px 0px 4px;
`;
export const WarpperPriceText = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: rgb(255,66,78);
`;
export const WarpperDiscountText = styled.span`
    font-size: 12px;
    font-weight: 400;
    color: rgb(255,66,78);
`;