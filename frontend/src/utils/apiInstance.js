import axios from 'axios';
import { apiData } from './apiData';

const ACCESS_TOKEN = 'shoonya_access_token';
const REFRESH_TOKEN = 'shoonya_refresh_token';
const TOKEN_NOT_VALID = 'token_not_valid';

const REFRESH_URL = 'users/auth/jwt/refresh';

const axiosInstance = axios.create({
    baseURL: apiData.url,
    timeout: 500000,
    headers: {
        Authorization: localStorage.getItem(ACCESS_TOKEN)
            ? 'JWT ' + localStorage.getItem(ACCESS_TOKEN)
            : null,
        'Content-Type': 'application/json',
        accept: 'application/json',
    }
});

axiosInstance.interceptors.response.use((response) => {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;

        if (typeof error.response === 'undefined') {
            alert(
                'Unknown server error!'
            );
            return Promise.reject(error);
        }

        if  (error.response.status === 401 && originalRequest.url === apiData.url + REFRESH_URL) {
            window.location.href = '/login';
            return Promise.reject(error);
        }

        if (error.response.data.code === TOKEN_NOT_VALID && error.response.status === 401 && error.response.statusText === 'Unauthorized') {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);

            if (refreshToken) {
                const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
                const now = Math.ceil(Date.now() / 1000);

                if (tokenParts.exp > now) {
                    return axiosInstance
                            .post(REFRESH_URL, {
                                refresh: refreshToken,
                            })
                            .then((response) => {
                                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                                localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

                                axiosInstance.defaults.headers['Authorization'] =
                                    'JWT ' + response.data.access;
                                    originalRequest.headers['Authorization'] =
                                    'JWT ' + response.data.access;

                                return axiosInstance(originalRequest);
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                } else {
                    window.location.href = '/';
                }
            } else {
                window.location.href = '/';
            }

            return Promise.reject(error);
        }
    }
);

export default axiosInstance;