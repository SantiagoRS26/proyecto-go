import { AxiosInstance, AxiosError } from 'axios';

export const setupInterceptors = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token)
      }
      return response
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        window.location.href = '/login'
      }

      if (error.response?.status === 500) {
        console.error('Server error. Try again later.')
      }

      return Promise.reject(error)
    }
  );
};
