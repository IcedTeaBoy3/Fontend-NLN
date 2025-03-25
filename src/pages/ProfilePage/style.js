import { Upload } from "antd";
import styled from "styled-components";
export const WarpperHeaderProfile = styled.h1`
    color: #000;

    font-size: 18px;
    margin: 4px 0;
`
export const WarpperContentProfile = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    width: 560px;
    margin: 0 auto;
    padding: 30px;
    border-radius: 10px;
    gap: 30px;
`
export const WarpperLabel = styled.label`
    font-size: 12px;
    color: #000;
    line-height: 30px;
    font-weight: 600;
    width: 100px;
    text-align: left;
`
export const WarpperInput = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
`
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