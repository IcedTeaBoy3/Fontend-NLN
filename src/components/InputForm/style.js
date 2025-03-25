import styled from 'styled-components'
import { Input } from 'antd'
export const WarpperInput = styled(Input)`
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: none;
    outline: none;
    &:focus {
        background-color: rgb(232,240,255);
    }
`
