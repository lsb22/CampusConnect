import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import useMessageStore from "../store/LatestMessagesStore";

interface Props {
  socket: Socket;
}

const HomePage = ({ socket }: Props) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const { insert, logIn, users_latitude, users_longitude } = useMessageStore();

  const handleClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username) {
      socket.username = username; // Added this custom username property by modifying types file in src folder
      socket.connect();

      socket.emit("newUser", { username, users_latitude, users_longitude });

      socket.on("prevMessages", (data) => {
        insert(data);
      });
      logIn(true);
      navigate("/chatpage");
    } else alert("Enter valid username!!!");
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
