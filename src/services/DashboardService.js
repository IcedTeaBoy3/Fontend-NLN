import axios from 'axios';
import { axiosJWT } from './UserService';

export const getRevenueByDay = async (access_token) => {
    try {
        const response = await axiosJWT.get(
            `${import.meta.env.VITE_APP_URL}/api/dashboard/get-revenue-by-day`,{
                headers: {
                    token: `Bearer ${access_token}`,
                },
            }

        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export const getRevenueByMonth = async (access_token) => {
    try {
        const response = await axiosJWT.get(
            `${import.meta.env.VITE_APP_URL}/api/dashboard/get-revenue-by-month`,{
                headers: {
                    token: `Bearer ${access_token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export const getRevenueByYear = async (access_token) => {
    try {
        const response = await axiosJWT.get(
            `${import.meta.env.VITE_APP_URL}/api/dashboard/get-revenue-by-year`,{
                headers: {
                    token: `Bearer ${access_token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export const getTotalRevenue = async (access_token) => {
    try {
        const response = await axiosJWT.get(
            `${import.meta.env.VITE_APP_URL}/api/dashboard/get-total-revenue`,{
                headers: {
                    token: `Bearer ${access_token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export const getPaidVsUnpaidOrders = async (access_token) => {
    try {
        const response = await axiosJWT.get(
            `${import.meta.env.VITE_APP_URL}/api/dashboard/paidvsunpaid`,{
                headers: {
                    token: `Bearer ${access_token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
