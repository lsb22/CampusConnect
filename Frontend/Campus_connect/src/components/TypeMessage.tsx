import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Show,
} from "@chakra-ui/react";
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
          <InputGroup size="md">
            <Input
              className="message-typer"
              display="inline"
              placeholder="Type Message"
              variant="filled"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                type="submit"
                colorScheme="teal"
                pt="18px"
                pr="20px"
                pl="20px"
                pb="22px"
              >
                Send
              </Button>
            </InputRightElement>
          </InputGroup>
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
        <InputGroup>
          <Input
            className="message-typer"
            placeholder="Type Message"
            variant="filled"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <InputRightElement width="4rem">
            <Button
              type="submit"
              colorScheme="teal"
              pt="15px"
              pr="20px"
              pl="20px"
              pb="20px"
            >
              Send
            </Button>
          </InputRightElement>
        </InputGroup>
      </Show>
    </form>
  );
};

export default TypeMessage;
