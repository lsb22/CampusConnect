import { Box, Button, HStack, Text } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Box p={2}>
      <HStack justifyContent="space-between">
        <Text fontSize="1.2rem">Hangout with the fellow students</Text>
        <Button colorScheme="red">Leave Chat</Button>
      </HStack>
    </Box>
  );
};

export default Navbar;
