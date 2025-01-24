import "./App.css";
import { Box } from "@chakra-ui/react";
import socket from "./services/Socket";
import HomePage from "./components/HomePage";
import ChatPage from "./components/ChatPage";
import { Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp";
import getUserLocation from "./services/FetchUserLocation";

function App() {
  getUserLocation(socket);
  return (
    <Box>
      <Routes>
        <Route path="/" element={<HomePage socket={socket} />} />
        <Route path="/chatpage" element={<ChatPage socket={socket} />} />
        <Route path="/signup" element={<SignUp socket={socket} />} />
      </Routes>
    </Box>
  );
}

export default App;
