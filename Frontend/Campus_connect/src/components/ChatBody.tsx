import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { MessageStruct } from "./ChatPage";
import { Socket } from "socket.io-client";

interface Props {
  messages: MessageStruct[];
  socket: Socket;
}

const ChatBody = ({ messages, socket }: Props) => {
  return (
    <Box overflowY="auto">
      {messages.map((message, idx) => (
        <Flex
          flex="1fr"
          justifyContent={
            message.userName === socket.username ? "end" : "start"
          }
          key={idx}
          mt={10}
        >
          <VStack
            alignItems={message.userName === socket.username ? "end" : "start"}
          >
            <Text p={1} className="username">
              {message.userName === socket.username ? "You" : message.userName}
            </Text>
            <Text
              className="message-text"
              bgColor={
                message.userName === socket.username ? "teal" : "lightcoral"
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
