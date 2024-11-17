import { io } from "socket.io-client";

const url = "http://localhost:3000";

const socket = io(url, { autoConnect: false }); // will connect the user after he enters his username

export default socket;
