import styled from 'styled-components';
import { Col } from 'antd';
export const WarpperProducts = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 20px;
    flex-wrap: wrap;
`
export const WarpperNavbar = styled(Col)`
    background-color: #fff;
    margin-right: 10px;
    padding: 10px;
    border-radius: 4px;
    height: fit-content;
    margin-top: 20px;
    width: 200px;
`
export const WarpperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap:24px;
    height: 44px;
`