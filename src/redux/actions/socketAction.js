import {
  INITIAL_SOCKET_IO,
  DESTROY_SOCKET_IO
} from '../types';

export const initSocket = () => {
  return dispatch => {
    dispatch({ type: INITIAL_SOCKET_IO });
  };
};

export const destroySocket = () => {
  return dispatch => {
    dispatch({ type: DESTROY_SOCKET_IO });
  };
};
