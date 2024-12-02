import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface Props {
  socket: Socket;
}

const Navbar = ({ socket }: Props) => {
  const navigate = useNavigate();

  const handleclick = () => {
    socket.disconnect();
    navigate("/");
  };

  return (
    <Box p={2}>
      <HStack justifyContent="space-between">
        <Text className="nav-header">Hangout with the fellow students</Text>
        <Button colorScheme="red" onClick={handleclick}>
          <Text className="exit-button-text">Leave Chat</Text>
        </Button>
      </HStack>
    </Box>
  );
};

export default Navbar;
