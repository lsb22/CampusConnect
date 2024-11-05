import { Box, Flex, Text } from "@chakra-ui/react";
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
          justifyContent={idx % 2 === 0 ? "end" : "start"}
          key={idx}
          mt={5}
        >
          <Text
            fontSize="1.3rem"
            bgColor="teal"
            px={10}
            py={2}
            borderRadius={10}
          >
            {message.text}
          </Text>
        </Flex>
      ))}
    </Box>
  );
};

export default ChatBody;
