import axios from "axios";

const API_URL = "/api/blogs";

export const fetchBlogs = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const fetchBlogsPublished = async () => {
    const response = await axios.get(`${API_URL}/published`, {
        withCredentials: true,
    });
    return response.data;
};

export const fetchBlogsDraft = async () => {
    const response = await axios.get(`${API_URL}/draft`);
    return response.data;
};

export const fetchBlogById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createBlog = async (blogData) => {
    const response = await axios.post(API_URL, blogData);
    return response.data;
};

export const updateBlog = async (id, blogData) => {
    const response = await axios.put(`${API_URL}/${id}`, blogData);
    return response.data;
};

export const deleteBlogApi = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
