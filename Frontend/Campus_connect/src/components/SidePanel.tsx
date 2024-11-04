import { VStack, Text, Box } from "@chakra-ui/react";

const SidePanel = () => {
  return (
    <VStack alignItems="start" pl={4}>
      <Text fontSize="2rem" mb={5}>
        Open Chat
      </Text>
      <VStack className="active-users" alignItems="start">
        <Box>
          <Text fontSize="2rem" mb={3}>
            Active Users
          </Text>
        </Box>
        <Box fontSize="1.4rem">
          <Box mb={2}>User-1</Box>
          <Box mb={2}>User-2</Box>
          <Box mb={2}>User-3</Box>
        </Box>
      </VStack>
    </VStack>
  );
};

export default SidePanel;
