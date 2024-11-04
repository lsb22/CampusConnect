import "./App.css";
import { Box } from "@chakra-ui/react";
import socket from "./services/Socket";
import HomePage from "./components/HomePage";
import ChatPage from "./components/ChatPage";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Box>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chatpage" element={<ChatPage />} />
      </Routes>
    </Box>
  );
}

export default App;
