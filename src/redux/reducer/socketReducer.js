import { io } from "socket.io-client";
import {
  INITIAL_SOCKET_IO,
  DESTROY_SOCKET_IO
} from "../types";

const INITIAL_STATE = {
  socket: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case INITIAL_SOCKET_IO:
      {
        if (!state.socket) {
          return {
            ...state,
            socket: io(window.NXT_API_BASE_URL)
          };
        }
        return state
      }
    case DESTROY_SOCKET_IO:
      if (state.socket) {
        state.socket.disconnect();
      }
      return {
        ...state,
        socket: null
      };
    default:
      return state;
  }
};