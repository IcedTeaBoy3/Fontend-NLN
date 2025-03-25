import axios from 'axios';
import { axiosJWT } from './UserService';

export const getAllProducts = async (search,limit) => {
    try {
        let response = {}
        if(search?.length > 0) {
            response = await axios.get(
                `${import.meta.env.VITE_APP_URL}/api/products/get-all-products?filter=name&filter=${search}&limit=${limit}`
            );
        } else {
            response = await axios.get(
                `${import.meta.env.VITE_APP_URL}/api/products/get-all-products?limit=${limit}`
            );
        }
        return response.data;
    } catch (error) {
        // console.error(error);
    }
};
export const getProductType = async (type,page,limit) => {
    try {
        const response = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/products/get-all-products?filter=type&filter=${type}&page=${page}&limit=${limit}`
        );
        return response.data;
    } catch (error) {
        // console.error(error);
    }
}
// Create Product
export const createProduct = async (product,token) => {
    try {
        const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/api/products/create-product`,
        product,
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
export const getDetailProduct = async (id) => {
    try {
        const response = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/products/get-product/${id}`
        );
        return response.data;
    } catch (error) {
        // console.error(error);
    }
}
export const updateProduct = async (id, data, access_token) => {
    try {
        const response = await axiosJWT.put(
        `${import.meta.env.VITE_APP_URL}/api/products/update-product/${id}`,
        data,
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
export const deleteProduct = async (id, access_token) => {
    try {
        const response = await axiosJWT.delete(
        `${import.meta.env.VITE_APP_URL}/api/products/delete-product/${id}`,
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
export const deleteManyProducts = async (ids, access_token) => {
    try {
        const response = await axiosJWT.post(
        `${import.meta.env.VITE_APP_URL}/api/products/delete-many-products`, ids,
        {
            headers: {
                token: `Bearer ${access_token}`,
            }
        }
        );
        return response.data;
    } catch (error) {
        // console.error(error);
    }
}
export const getAllProductsType = async () => {
    try {
        const response = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/products/get-all-products-type`
        );
        return response.data;
    } catch (error) {
        // console.error(error);
    }
}