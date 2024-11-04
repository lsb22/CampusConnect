import { Box, Button, HStack, Text } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Box p={2}>
      <HStack justifyContent="space-between">
        <Text fontSize="1.1rem">Hangout with the fellow students</Text>
        <Button colorScheme="red" fontSize="1rem">
          Leave Chat
        </Button>
      </HStack>
    </Box>
  );
};

export default Navbar;
