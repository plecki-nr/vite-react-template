import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://qa-api-mock-3.eu-central-1.elasticbeanstalk.com';



const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        // token
    },
});

// Generic GET request for a single item by ID
export const get = async <T>(endpoint: string): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await axiosInstance.get(`/${endpoint}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
};

// Generic POST request to create a new item
export const post = async <T>(endpoint: string, data: T): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await axiosInstance.post(endpoint, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
};


// Generic PUT request to update a single item by ID
export const put = async <T>(endpoint: string, id: string, data: T): Promise<T> => {
    try {
        const response: AxiosResponse<T> = await axiosInstance.put(`${endpoint}/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
};

// Generic DELETE request to remove a single item by ID
export const remove = async (endpoint: string, id: string): Promise<void> => {
    try {
        await axiosInstance.delete(`${endpoint}/${id}`);
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message);
    }
};