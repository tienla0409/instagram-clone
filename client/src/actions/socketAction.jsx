import io from "socket.io-client";
import {
  SOCKET_CONNECT,
  SOCKET_DISCONNECT,
} from "../constants/socketConstants";

export const connectSocket = (userInfo) => (dispatch) => {
  const socket = io(process.env.REACT_APP_SOCKET_URL_SERVER);

  socket.on("disconnect", () => {
    console.log("socket disconnect from server");
    dispatch({ type: SOCKET_DISCONNECT });
  });

  socket.emit("client-online", userInfo);

  dispatch({ type: SOCKET_CONNECT, payload: socket });
};