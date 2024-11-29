import { io } from "socket.io-client";

const url = import.meta.env.VITE_SOCKET_URL;

const socket = io(url, {
  autoConnect: false,
  reconnection: true,
  withCredentials: true,
  transports: ["websocket", "polling"],
}); // will connect the user after he enters his username

export default socket;
