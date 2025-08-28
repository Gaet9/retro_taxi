import axios from "axios";

const API_URL = "/api/news";

export const fetchNews = async () => {
    const response = await axios.get(`${API_URL}`, { withCredentials: true });
    return response.data;
};

export const fetchLatest = async () => {
    const response = await axios.get(`${API_URL}/latest`, { withCredentials: true });
    return response.data;
};

export const createNewsletter = async () => {
    const response = await axios.post(`${API_URL}/generate`, { withCredentials: true });
    return response.data;
};

export const SendNewsletter = async (userData) => {
    const response = await axios.post(`${API_URL}/send`, userData);
    return response.data;
};
