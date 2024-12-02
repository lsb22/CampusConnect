import { Box, Button, Hide, HStack, Show, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import UsersDrawer from "./UsersDrawer";
import { UserStruct } from "./ChatPage";

interface Props {
  socket: Socket;
  users: UserStruct[];
}

const Navbar = ({ socket, users }: Props) => {
  const navigate = useNavigate();

  const handleclick = () => {
    socket.disconnect();
    navigate("/");
  };

  return (
    <Box p={2}>
      <HStack justifyContent="space-between">
        <Hide above="lg">
          <UsersDrawer users={users} />
        </Hide>
        <Show above="lg">
          <Text className="nav-header">Hangout with the fellow students</Text>
        </Show>
        <Button colorScheme="red" onClick={handleclick}>
          <Text className="exit-button-text">Leave Chat</Text>
        </Button>
      </HStack>
    </Box>
  );
};

export default Navbar;
