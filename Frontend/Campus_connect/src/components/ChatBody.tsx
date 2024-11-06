import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { MessageStruct } from "./ChatPage";

interface Props {
  messages: MessageStruct[];
}

const ChatBody = ({ messages }: Props) => {
  return (
    <Box overflowY="auto">
      {messages.map((message, idx) => (
        <Flex
          flex="1fr"
          justifyContent={
            message.userName === localStorage.getItem("username")
              ? "end"
              : "start"
          }
          key={idx}
          mt={10}
        >
          <VStack
            alignItems={
              message.userName === localStorage.getItem("username")
                ? "end"
                : "start"
            }
          >
            <Text p={2}>
              {message.userName === localStorage.getItem("username")
                ? "You"
                : message.userName}
            </Text>
            <Text
              fontSize="1.3rem"
              bgColor={
                message.userName === localStorage.getItem("username")
                  ? "teal"
                  : "lightcoral"
              }
              px={10}
              py={2}
              borderRadius={10}
              maxWidth="600px"
            >
              {message.text}
            </Text>
          </VStack>
        </Flex>
      ))}
    </Box>
  );
};

export default ChatBody;
