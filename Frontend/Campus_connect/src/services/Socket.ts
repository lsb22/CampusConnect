import { io } from "socket.io-client";

// const url = "http://localhost:3000";
const url = import.meta.env.VITE_SOCKET_URL;

const socket = io(url, { autoConnect: false, reconnection: true }); // will connect the user after he enters his username

export default socket;
