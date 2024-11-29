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
        <Text fontSize="1.1rem">Hangout with the fellow students</Text>
        <Button colorScheme="red" fontSize="1rem" onClick={handleclick}>
          Leave Chat
        </Button>
      </HStack>
    </Box>
  );
};

export default Navbar;
