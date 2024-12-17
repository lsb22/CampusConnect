import { HStack, Input, Show } from "@chakra-ui/react";
import { useState } from "react";
import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
}

const TypeMessage = ({ socket }: Props) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | undefined>();

  const handleMessageSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (file) {
      console.log(file);
      const messageObject = {
        file: true,
        body: file,
        mimeType: file.type,
        fileName: file.name,
        userName: socket.username,
        socketId: socket.id,
        id: `${socket.id}${Math.random()}`,
        time: new Date(),
      };
      // setMessage("");
      setFile(undefined);
      socket.emit("message", messageObject);
    } else if (message.trim() && socket.username) {
      socket.emit("message", {
        text: message,
        userName: socket.username,
        socketId: socket.id,
        id: `${socket.id}${Math.random()}`,
        time: new Date(),
      });
    }
    setMessage("");
  };

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setMessage(event.target.files[0].name);
      setFile(event.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleMessageSubmit}>
      <Show above="lg">
        <HStack>
          <Input
            display="inline"
            type="file"
            width="100px"
            fontSize="10px"
            overflowX="scroll"
            onChange={selectFile}
            pt={3}
            pr={40}
          />
          <Input
            className="message-typer"
            display="inline"
            placeholder="Type Message"
            variant="filled"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </HStack>
      </Show>
      <Show below="lg">
        <Input
          type="file"
          width="150px"
          fontSize="8px"
          overflowX="scroll"
          onChange={selectFile}
          pt={3}
          mb={3}
        />
        <Input
          className="message-typer"
          placeholder="Type Message"
          variant="filled"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Show>
    </form>
  );
};

export default TypeMessage;
