import CustomerService from './customerService';
import DashboardService from './dashboardService';
import FaceService from './faceService';
import SystemConfigService from './systemConfigService';
import UserService from './userService';
import VoiceService from './voiceService';

const API = {
    user: new UserService(),
    customer: new CustomerService(),
    dashboard: new DashboardService(),
    face: new FaceService(),
    voice: new VoiceService(),
    systemConfigService: new SystemConfigService()
};

export default API;