import axios from 'axios';
import { NEXTFACE_ACCESS_TOKEN } from '../constants/app';

export default class BaseService {
    configApi(headers, baseURL) {
        const globalAxios = axios.create({
            //   baseURL: process.env.REACT_APP_REST_URL,
            baseURL: baseURL ? baseURL : window.NXT_API_BASE_URL
        });
        globalAxios.interceptors.request.use(function(config) {
            if (headers) {
                config.headers = headers;
            }
            config.headers.authorization = `Bearer ${localStorage.getItem(NEXTFACE_ACCESS_TOKEN)}`;
            return config;
        });

        globalAxios.interceptors.response.use(function(response) {
            if(response.status === 401){
                localStorage.removeItem(NEXTFACE_ACCESS_TOKEN);
                window.location.reload();
            }
            return response;
        });

        return globalAxios;
    }

    async post(url, data, headers) {
        const api = this.configApi(headers);
        const res = await api.post(url, data);

        if (res && res.data) {
            return res.data;
        }

        return res;
    }

    async get(url, params) {
        const res = await this.configApi().get(url, { params: params });
        if (res && res.data) {
            return res.data;
        }

        return res;
    }

    async put(url, data) {
        const res = await this.configApi().put(url, data);

        if (res && res.data) {
            return res.data;
        }

        return res;
    }

    async delete(url, data) {
        const res = await this.configApi().delete(url, data);

        if (res && res.data) {
            return res.data;
        }

        return res;
    }
}