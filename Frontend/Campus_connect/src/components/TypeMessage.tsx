import { Input } from "@chakra-ui/react";
import { useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
}

const TypeMessage = ({ socket }: Props) => {
  const [message, setMessage] = useState("");

  const handleMessageSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (message.trim() && localStorage.getItem("username")) {
      socket.emit("message", {
        text: message,
        userName: localStorage.getItem("username"),
        socketId: socket.id,
        id: `${socket.id}${Math.random()}`,
      });
    }
    setMessage("");
  };

  return (
    <form onSubmit={handleMessageSubmit}>
      <Input
        height="60px"
        placeholder="Type Message"
        variant="filled"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </form>
  );
};

export default TypeMessage;
