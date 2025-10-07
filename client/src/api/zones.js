import axios from "axios";

const API_URL = "/api/zones";

// Public routes (no authentication required)
export const getAllZones = async () => {
    const response = await axios.get(`${API_URL}/`, { withCredentials: false });
    return response.data;
};

// Admin-only routes (require authentication and admin role)
export const createZone = async (zoneData) => {
    const response = await axios.post(`${API_URL}/`, zoneData, { withCredentials: true });
    return response.data;
};

export const updateZone = async (id, zoneData) => {
    const response = await axios.put(`${API_URL}/${id}`, zoneData, { withCredentials: true });
    return response.data;
};

export const deleteZone = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
    return response.data;
};
