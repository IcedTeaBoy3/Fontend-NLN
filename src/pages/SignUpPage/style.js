import styled from 'styled-components'
export const WarpperContainerLeft = styled.div`
    width: 500px;
    flex: 1;
    padding: 40px 45px 24px;
    display: flex;
    flex-direction: column;
`
export const WarpperContainerRight = styled.div`
    width: 300px;
    background: linear-gradient(136deg,rgb(240,248,255) -1%,rgb(219,238,255) 85%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    gap: 4px;
`
export const  WarpperTextLight = styled.span`
    font-size: 14px;
    color: rgb(13,92,182);
`
export const WarpperTextRight = styled.h3`
    margin: 0px 0px 5px;
    color: rgb(10, 104, 255);
    font-size: 18px;
    font-weight: 500;
    line-height: 24px;
`
export const WarpperTextRightBottom = styled.p`
    font-size: 14px;
    color: rgb(10, 104, 255);
    font-weight: 400;
    line-height: 20px;
`