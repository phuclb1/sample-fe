import { API_URLs } from '../constants/app';
import BaseService from './baseService';

class FaceService extends BaseService {
    async search(params) {
        const res = await this.get(API_URLs.FACE, params);
        return res;
    }
    async create(data) {
        const res = await this.post(API_URLs.FACE, data);
        return res;
    }
    async upload(data) {
        const res = await this.post(API_URLs.FACE + '/upload', data, {
            "Content-Type": "application/x-www-form-urlencoded"
        });
        return res;
    }
    async update(id, data) {
        const res = await this.put(`${API_URLs.FACE}/${id}`, data);
        return res;
    }
    async getById(id) {
        const res = await this.get(`${API_URLs.FACE}/${id}`);
        return res;
    }
    async deleteById(id) {
        const res = await this.delete(`${API_URLs.FACE}/${id}`);
        return res;
    }
    async searchFace(data) {
        const res = await this.post(`${API_URLs.FACE}/search`, data);
        return res;
    }
    async compareFace(data) {
        const res = await this.post(`${API_URLs.FACE}/verify`, data);
        return res;
    }
}

export default FaceService;