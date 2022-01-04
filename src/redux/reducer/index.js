import { combineReducers } from 'redux';
import user from './userReducer';
import socketio from './socketReducer';

export default combineReducers({
    user,
    socketio
});