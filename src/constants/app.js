export const NEXTFACE_ACCESS_TOKEN = "NEXTFACE_ACCESS_TOKEN";
export const DEFAULT_AVATAR = '/images/01.png';
export const DATE_TIME_FORMAT = 'ddd, MMM DD, yyyy - h:mm:ss A';
export const ITEMS_PER_PAGE = 10;
export const DATE_FORMAT = 'DD/MM/YYYY';
export const USER_ROLE = {
    USER: 'USER',
    ADMIN: 'ADMIN'
};
export const USER_TYPE = {
    FACE: 'FACE',
    VOICE: 'VOICE'
};
export const NEXTFACE_RESOURCE_URL = "https://18.139.72.29:30091/avatars";
export const NUM_OF_SEARCH_RESULT = [{ value: 1, label: "Top 1" }, { value: 5, label: "Top 5" }, { value: 10, label: "Top 10" }];
export const DEFAULT_IMAGE = '/images/No_Image_Available.jpg';

export const API_URLs = {
    LOGIN: '/api/v1/auth/login',
    LOG_OUT: '/api/v1/auth/logout',
    GET_USER_INFO: '/api/v1/users/me',
    FACE: '/api/v1/faces',
    VOICE: '/api/v1/voices',
    GET_RESOURCE: '/api/v1/file',
}
export const ROUTES = {
    WELCOME: '/welcome',
    FACES: '/face',
    VOICES: '/voice',

    // Share
    LOGIN: '/login',
    FACE_SEARCH_DEMO: '/face-search-demo',
    FACE_COMPARE_DEMO: '/face-compare-demo',
    VOICE_MATCH_DEMO: '/voice-match-demo',
    ACCESS_DENIED: '/403',
    PAGE_NOT_FOUND: '/404',
}
export const MENUS = [
    // { route: '', title: 'FACE SERVICES', icon: '', isGroup: true, roles: USER_ROLE.USER, type: USER_TYPE.FACE },
    // { route: ROUTES.FACES, title: 'Face Management', icon: 'fas fa-expand', roles: USER_ROLE.USER, type: USER_TYPE.FACE },
    { route: '', title: 'VOICE SERVICES', icon: '', isGroup: true, type: USER_TYPE.VOICE },
    { route: ROUTES.VOICES, title: 'Voice Management', icon: 'far fa-file-audio', type: USER_TYPE.VOICE },
    // { route: 'https://documenter.getpostman.com/view/4111892/UUy1fSsn#09b378d8-5506-4f8f-9b19-410008d49caf', title: 'API Documents', icon: 'far fa-save', external: true, roles: USER_ROLE.USER, type: USER_TYPE.FACE },
    // { route: 'https://documenter.getpostman.com/view/4078648/UV5ZCGsC', title: 'API Documents', icon: 'far fa-save', external: true, roles: USER_ROLE.USER, type: USER_TYPE.VOICE },

    { route: '', title: 'DEMOS', icon: '', isGroup: true, roles: USER_ROLE.USER },
    { route: ROUTES.VOICE_MATCH_DEMO, title: 'Voice Match Demo', icon: 'fas fa-microphone-alt', type: USER_TYPE.VOICE },
    // { route: ROUTES.FACE_SEARCH_DEMO, title: 'Face Search Demo', icon: 'fas fa-search', type: USER_TYPE.FACE },
    { route: ROUTES.FACE_COMPARE_DEMO, title: 'Face Compare Demo', icon: 'far fa-object-ungroup', type: USER_TYPE.FACE }
]