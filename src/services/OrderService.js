// Create Product
import axios from 'axios';
import { axiosJWT } from './UserService';
export const createOrder = async (data,token) => {
    try {
        const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/api/orders/create-order`,
        data,
        {
            headers: {
                token: `Bearer ${token}`,
            },
        }
        );
        return response.data;
    } catch (error) {
        // console.error(error);
    }
};
export const getAllOrder = async (id,access_token) => {
    try {
        const response = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/orders/get-all-order/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        }
        );
        return response.data;
    } catch (error) {
        // console.error(error);
    }
};
export const getDetailOrder = async (id,access_token) => {
    try {
        const response = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/orders/get-detail-order/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        }
        );
        return response.data;
    } catch (error) {
        // console.error(error);
    }
};
export const cancelOrder = async (id,access_token) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_APP_URL}/api/orders/cancel-order/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        }
        );
        return response.data;
    } catch (error) {
        // console.error(error);
    }
}
export const getAllOrderAdmin = async (access_token) => {
    try {
        const response = await axiosJWT.get(
        `${import.meta.env.VITE_APP_URL}/api/orders/get-all-order`
        ,{
            headers: {
                token: `Bearer ${access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        // console.error(error);
    }
}