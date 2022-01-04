import { API_URLs } from '../constants/app';
import BaseService from './baseService';
import { NEXTFACE_ACCESS_TOKEN } from '../constants/app';

class CustomerService extends BaseService {
    async search(params) {
        const res = await this.get(API_URLs.CUSTOMER, params);
        return res;
    }
    async create(data) {
        const res = await this.post(API_URLs.USER, data);
        return res;
    }
    async update(id, data) {
        const res = await this.put(`${API_URLs.USER}/${id}`, data);
        return res;
    }
    async changePassword(data) {
        const res = await this.post(`${API_URLs.USER}/changepassword`, data);
        return res;
    }
    async getById(id) {
        const res = await this.get(`${API_URLs.USER}/${id}`);
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
    async transactionLogStatisticForCustomer(fromDate, toDate, type, page, pageSize) {
        let url = `${API_URLs.USER_TRANSACTION_STATISTIC}/me?from=${fromDate}&to=${toDate}&type=${type}`;
        if (type === 'table') {
            url += `&page=${page}&pagesize=${pageSize}`;
        }
        const res = await this.get(url);
        return res;
    }
    async deleteById(id) {
        const res = await this.delete(`${API_URLs.USER}/${id}`);
        return res;
    }
    async getDashboardSummary() {
        let url = API_URLs.DASHBOARD_CUSTOMER_SUMMARY;
        const res = await this.get(url);
        return res;
    }
    async getDashboardStatistic(fromDate, toDate) {
        let url = `${API_URLs.DASHBOARD_CUSTOMER_STATISTIC}?from=${fromDate}&to=${toDate}`;
        const res = await this.get(url);
        return res;
    }
    async getVerifiedRequests(fromDate, toDate, pageIndex, pageSize, voice_id) {
        let url = `${API_URLs.VERIFIED_REQUESTS}?from=${fromDate}&to=${toDate}&page=${pageIndex}&pagesize=${pageSize}`;
        if (voice_id) {
            url += '&voice_id=' + voice_id;
        }
        const res = await this.get(url);
        return res;
    }
    async verifyNotCorrect(isFace, data) {
        const res = await this.post(`${isFace ? API_URLs.FACE : API_URLs.VOICE}/verify/not-correct`, data);
        return res;
    }
    getResource(path) {
        if (!path) return '';
        let access_token = localStorage.getItem(NEXTFACE_ACCESS_TOKEN);
        let url = `${window.NXT_RESOURCE_URL}${API_URLs.GET_RESOURCE}?path=${path}&token=${access_token}`;
        return url;
    }
}

export default CustomerService;