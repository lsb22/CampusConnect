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
    if (message.trim() && socket.username) {
      socket.emit("message", {
        text: message,
        userName: socket.username,
        socketId: socket.id,
        id: `${socket.id}${Math.random()}`,
      });
    }
    setMessage("");
  };

  return (
    <form onSubmit={handleMessageSubmit}>
      <Input
        className="message-typer"
        // height="60px"
        placeholder="Type Message"
        variant="filled"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </form>
  );
};

export default TypeMessage;
