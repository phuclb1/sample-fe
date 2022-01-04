import { API_URLs } from '../constants/app';
import BaseService from './baseService';

class SystemConfigService extends BaseService {
    async getAll() {
        const res = await this.get(`${API_URLs.SYSTEM_CONFIGS}`);
        return res;
    }
    async update(id, data) {
        const res = await this.put(`${API_URLs.SYSTEM_CONFIGS}/${id}`, data);
        return res;
    }
}

export default SystemConfigService;