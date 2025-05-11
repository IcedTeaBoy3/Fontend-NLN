
import {Row} from 'antd'
import styled from 'styled-components'

export const WarpperHeader = styled(Row)`
    align-items: center;
    flex-wrap: nowrap;
    width: 1270px;
    padding: 10px 0px;
`
export const WarpperTextHeader = styled.span`
    color: white;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    text-transform: uppercase;
    border-radius: 5px;
    border: 2px solid white;
    transition: all 0.3s;
    box-shadow: 0px 0px 5px 0px white;
    &:hover{
        transform: scale(1.05);
        background-color: white;
    }
    &:active {
        transform: scale(0.95);
    }
`
export const WarpperTextHeaderSmall = styled.span`
    color: white;
    font-size: 12px;
    white-space: nowrap;
`
export const WarpperHeaderAccount = styled.div`
    display: flex;
    align-items: center; 
    color: white;
    gap:5px;
`
export const WarpperContentPopover = styled.p`
    cursor: pointer;
    margin: 0px;
    padding: 8px;
    
`