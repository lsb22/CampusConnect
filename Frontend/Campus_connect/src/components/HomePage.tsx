import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

interface Props {
  socket: Socket;
}

const HomePage = ({ socket }: Props) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.connect();
    if (username) navigate("/chatpage");
    else alert("Enter valid username!!!");
  };

  return (
    <VStack justifyContent="center" height="100vh">
      <Box border="1px solid gray" p={10} borderRadius={10}>
        <form onSubmit={handleClick}>
          <FormControl mb={5}>
            <FormLabel>UserName:</FormLabel>
            <Input onChange={(e) => setUsername(e.target.value)} />
          </FormControl>
          <Button type="submit">Enter chat...</Button>
        </form>
      </Box>
    </VStack>
  );
};

export default HomePage;
