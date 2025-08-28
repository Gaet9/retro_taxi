import axios from "axios";

const API_URL = "/api/users";

export const fetchUsers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const fetchUserById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const fetchUserWithToken = async () => {
    const response = await axios.get(`${API_URL}/me`, { withCredentials: true });
    return response.data;
};

export const createUser = async (userData) => {
    const response = await axios.post(API_URL, userData);
    return response.data;
};

export const updateUser = async (userData) => {
    const response = await axios.put(`${API_URL}/me`, userData, { withCredentials: true });
    return response.data;
};

export const deleteUserApi = async () => {
    const response = await axios.delete(`${API_URL}/me`, { withCredentials: true });
    return response.data;
};

export const updateUserRole = async (userId, role) => {
    const response = await axios.put(`${API_URL}/${userId}/role`, { role });
    return response.data;
};

export const updateUserNewsletter = async (userId, newsletter) => {
    const response = await axios.put(`${API_URL}/${userId}/newsletter`, { newsletter });
    return response.data;
};

export const approveAdminRequest = async (userId) => {
    const response = await axios.put(`${API_URL}/${userId}/approve-admin`, { role: "admin" });
    return response.data;
};

export const denyAdminRequest = async (userId) => {
    const response = await axios.put(`${API_URL}/${userId}/deny-admin`, { role: "user" });
    return response.data;
};
