import { API_URLs } from '../constants/app';
import BaseService from './baseService';

class DashboardService extends BaseService {
    async getSummary() {
        const res = await this.get(API_URLs.DASHBOARD_SUMMARY);
        return res;
    }
    async usersStatistic(fromDate, toDate) {
        const res = await this.get(`${API_URLs.DASHBOARD_USER_STATISTIC}?from=${fromDate}&to=${toDate}`);
        return res;
    }
    async transactionLogStatistic(fromDate, toDate) {
        const res = await this.get(`${API_URLs.DASHBOARD_TRANSACTION_STATISTIC}?from=${fromDate}&to=${toDate}`);
        return res;
    }
}

export default DashboardService;