import axios from "axios";

const API_URL = "/api/contact";

export const fetchContact = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const fetchContactById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createContact = async (contactData) => {
    const response = await axios.post(API_URL, contactData);
    return response.data;
};

export const deleteContact = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
