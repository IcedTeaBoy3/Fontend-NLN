import styled from 'styled-components';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
export const WarpperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap:24px;
    justify-content: flex-start;
    height: 44px;
`
export const WarpperButtonMore = styled(ButtonComponent)`

    &:hover {
        background-color: rgb(13,92,182);
        span{
            color: #fff;
        }
    }
    width: 240px;
    text-align: center;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`
export const WarpperProducts = styled.div`
    display: flex;
    gap:14px;
    flex-wrap: wrap;
    margin-top: 25px;
`