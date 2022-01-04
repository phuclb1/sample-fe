import API from '../../services/API';
import {
    INITIAL_STATE_LOGIN_REQUEST,
    INITIAL_STATE_LOGIN,
    INITIAL_STATE_LOGIN_ERROR,
    INITIAL_STATE_LOG_OUT_REQUEST,
    INITIAL_STATE_LOG_OUT_ERROR,
    INITIAL_STATE_LOG_OUT,
    INITIAL_STATE_PROFILE_REQUEST,
    INITIAL_STATE_PROFILE,
    INITIAL_STATE_PROFILE_ERROR
} from '../types';
import { toast } from 'react-toastify';
import { NEXTFACE_ACCESS_TOKEN } from '../../constants/app';
import { history } from '../../router/history';

export const login = (username, password, remember) => {
    return async dispatch => {
        dispatch({ type: INITIAL_STATE_LOGIN_REQUEST });
        try {
            const res = await API.user.login({ username: username, password: password});
            dispatch({
                type: INITIAL_STATE_LOGIN,
                payload: res,
            });
            localStorage.setItem(NEXTFACE_ACCESS_TOKEN, res.access_token);
            history.push('/');
        } catch (error) {
            toast.error("Login failed. " + error?.response?.data?.message);
            dispatch({
                type: INITIAL_STATE_LOGIN_ERROR,
                payload: error,
            });
        }
    };
};

export const logout = () => {
    return async dispatch => {
        localStorage.removeItem(NEXTFACE_ACCESS_TOKEN);
        dispatch({ type: INITIAL_STATE_LOG_OUT_REQUEST });
        try {
            const res = await API.user.logout();
            dispatch({
                type: INITIAL_STATE_LOG_OUT,
                payload: res,
            });
            // window.location.reload();
            history.push('/login');
        } catch (error) {
            // toast.error("Logout failed. " + error?.response?.data?.message);
            dispatch({
                type: INITIAL_STATE_LOG_OUT_ERROR,
                payload: error,
            });
            // window.location.reload();
            history.push('/login');
        }
    };
};

export const getUserInfo = () => {
    return async dispatch => {
        dispatch({ type: INITIAL_STATE_PROFILE_REQUEST });
        try {
            const access_token = localStorage.getItem(NEXTFACE_ACCESS_TOKEN);
            if(!access_token){
                logout();
            }else{
                const res = await API.user.getUserInfo();
                dispatch({
                    type: INITIAL_STATE_PROFILE,
                    payload: res,
                });
                dispatch({
                    type: INITIAL_STATE_LOGIN,
                    payload: true,
                });
            }
        } catch (error) {
            if(error?.response?.status === 401){
                dispatch(logout());
            }
            // toast.error("Get User Info error. " + error?.response?.data?.message);
            dispatch({
                type: INITIAL_STATE_PROFILE_ERROR,
                payload: error,
            });
        }
    };
};