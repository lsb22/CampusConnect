import { VStack, Text, Box, HStack } from "@chakra-ui/react";
import { UserStruct } from "./ChatPage";

interface Props {
  users: UserStruct[];
}

const SidePanel = ({ users }: Props) => {
  // console.log(users);
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
          {users.map((user, idx) => (
            <Box key={idx} mb={3}>
              <HStack>
                <Box className="active-users-dot" mr={3} />
                <Text fontSize="1.6rem">{user.username}</Text>
              </HStack>
            </Box>
          ))}
        </Box>
      </VStack>
    </VStack>
  );
};

export default SidePanel;
