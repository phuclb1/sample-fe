import { API_URLs } from '../constants/app';
import BaseService from './baseService';

class UserService extends BaseService {
    async login(params) {
        const res = await this.post(API_URLs.LOGIN, params);
        return res;
    }
    async logout() {
        const res = await this.post(API_URLs.LOG_OUT);
        return res;
    }
    async changePassword(params) {
        const res = await this.post(API_URLs.CHANGE_PASSWORD, params);
        return res;
    }
    async search(params) {
        const res = await this.get(API_URLs.USER, params);
        return res;
    }
    async create(data) {
        const res = await this.post(API_URLs.USER, data);
        return res;
    }
    async uploadAvatar(data) {
        const res = await this.post(API_URLs.USER + '/avatar', data);
        return res;
    }
    async update(id, data) {
        const res = await this.put(`${API_URLs.USER}/${id}`, data);
        return res;
    }
    async getById(id) {
        const res = await this.get(`${API_URLs.USER}/${id}`);
        return res;
    }
    async deleteById(id) {
        const res = await this.delete(`${API_URLs.USER}/${id}`);
        return res;
    }
    async getUserInfo(params) {
        const res = await this.get(API_URLs.GET_USER_INFO, params);
        return res;
    }
    async transactionLogStatistic(fromDate, toDate, type, page, pageSize, userId) {
        let url = `${API_URLs.USER_TRANSACTION_STATISTIC}?from=${fromDate}&to=${toDate}&type=${type}&user=${userId}`;
        if (type === 'table') {
            url += `&page=${page}&pagesize=${pageSize}`;
        }
        const res = await this.get(url);
        return res;
    }
    async statistic(id) {
        const res = await this.get(`${API_URLs.USER}/statistic/${id}`);
        return res;
    }
}

export default UserService;