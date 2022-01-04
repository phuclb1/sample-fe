import { API_URLs } from '../constants/app';
import BaseService from './baseService';

class VoiceService extends BaseService {
    async search(params) {
        const res = await this.get(API_URLs.VOICE, params);
        return res;
    }
    async create(data) {
        const res = await this.post(API_URLs.VOICE, data);
        return res;
    }
    async upload(data) {
        const res = await this.post(API_URLs.VOICE + '/upload', data, {
            "Content-Type": "application/x-www-form-urlencoded"
        });
        return res;
    }
    async update(id, data) {
        const res = await this.put(`${API_URLs.VOICE}/${id}`, data);
        return res;
    }
    async getById(id) {
        const res = await this.get(`${API_URLs.VOICE}/${id}`);
        return res;
    }
    async deleteById(id) {
        const res = await this.delete(`${API_URLs.VOICE}/${id}`);
        return res;
    }
    async compareVoice(data) {
        const res = await this.post(`${API_URLs.VOICE}/verify`, data);
        return res;
    }
}

export default VoiceService;