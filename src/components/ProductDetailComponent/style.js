import styled from 'styled-components';
import { Image,InputNumber } from 'antd';
export const WarpperStyleImageSmall = styled(Image)`
    width: 47px;
    height: 47px;
    padding: 4px;
    border: 1px solid rgb(235, 235, 240);
    border-radius: 4px;
`
export const WarpperProductName = styled.h1`
    color: rgb(39, 39, 42);
    font-size: 20px;
    font-weight: 500;
    line-height: 150%;
    word-break: break-word;
    white-space: break-spaces;
`
export const WarppperStarProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    line-height: 150%;
    font-weight: 400;
    color: rgb(39, 39, 42);
`
export const WarpperProductPrice=styled.div`
    display: flex;
    align-items: center;
    color: rgb(39, 39, 42);
    background: rgb(250,250,250);
    border-radius: 4px;
    gap: 8px;
    margin: 20px 0;
`
export const WarpperProducTextPrice= styled.h1`
    color: rgb(255, 66, 78);
    font-size: 24px;
    font-weight: 500;
    line-height: 150%;
    padding:10px;
    margin:0;
`
export const WarpperAddressProduct = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    span.address{
        text-decoration: underline;
        font-size:16px;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        
    }
    span.change-address{
        color: rgb(11, 116, 229);
        font-size: 18px;
        line-height: 24px;
        font-weight: 500;
        text-decoration: underline;
        cursor: pointer;
    }
`
export const WarpperQuantityProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    width: 110px;
    border: 1px solid #ccc;
    border-radius: 4px;
`

export const WarpperInputNumber = styled(InputNumber)`
    &.ant-input-number{
        width: 40px;
        border-top: none;
        border-bottom: none;
    }
    /* Ẩn nút tăng/giảm trên Chrome, Safari */
    .ant-input-number-handler-wrap {
        display: none !important;
    }

    
`