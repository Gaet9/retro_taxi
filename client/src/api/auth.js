import axios from "axios";

const API_URL = "/api/auth";

export const loginApi = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData, { withCredentials: true });
    return response.data;
};

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/create-account`, userData, { withCredentials: false });
    return response.data;
};

export const logoutApi = async () => {
    const response = await axios.post(`${API_URL}/logout`, null, { withCredentials: true });
    return response.data;
};
