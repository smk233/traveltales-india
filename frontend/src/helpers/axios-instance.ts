import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
