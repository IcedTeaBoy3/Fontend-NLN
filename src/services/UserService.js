import axios from "axios";
export const axiosJWT = axios.create(
);
export const loginUser = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_URL}/api/users/sign-in`,
      data
    );
    return response.data;
  } catch (error) {
    // console.error(error);
  }
};
export const loginUserGoogle = async (token) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_URL}/api/users/sign-in-google`,
      {token}
    );
    return response.data;
  } catch (error) {
    // console.error(error);
  }
}
export const signupUser = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_URL}/api/users/sign-up`,
      data
    );
    return response.data;
  } catch (error) {
    // console.error(error);
  }
};
export const getUser = async (userId, access_token) => {
  try {
    const response = await axiosJWT.get(
      `${import.meta.env.VITE_APP_URL}/api/users/get-user/${userId}`,
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
export const refreshToken = async (refresh_token) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_URL}/api/users/refresh-token`,{refresh_token}
    );
    return response.data;
  } catch (error) {
    // console.error(error);
  }
};
export const logoutUser = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_URL}/api/users/log-out`
    );
    return response.data;
  } catch (error) {
    // console.error(error);
  }
};
export const updateUser = async (userId, data, access_token) => {
  try {
    
    const response = await axiosJWT.put(
      `${import.meta.env.VITE_APP_URL}/api/users/update-user/${userId}`,
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
};
export const getAllUsers = async (access_token) => {
  try {
    const response = await axiosJWT.get(
      `${import.meta.env.VITE_APP_URL}/api/users/get-all-users`,
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
export const deleteUser = async (userId, access_token) => {
  try {
    const response = await axiosJWT.delete(
      `${import.meta.env.VITE_APP_URL}/api/users/delete-user/${userId}`,
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
export const deleteManyUsers = async (ids,access_token) => {
  try {
    const response = await axiosJWT.post(
      `${import.meta.env.VITE_APP_URL}/api/users/delete-many-users`, ids,
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