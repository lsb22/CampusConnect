import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { MessageStruct } from "./ChatPage";
import { Socket } from "socket.io-client";
import RenderImage from "./RenderImage";
import { useEffect, useRef } from "react";

interface Props {
  messages: MessageStruct[];
  socket: Socket;
  show?: boolean;
}

const ChatBody = ({ messages, socket, show }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  // const handleclick = () => {
  //   if (ref.current) ref.current.scrollIntoView();
  // };

  useEffect(() => {
    if (ref.current) ref.current.scrollIntoView();
  }, [messages]);

  const displayMessage = (message: MessageStruct, idx: number) => {
    if (message.file) {
      const blob = new Blob([message.body!], { type: "file" });

      return (
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
            <RenderImage blob={blob} fileName={message.fileName!} />
          </VStack>
        </Flex>
      );
    } else {
      return (
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
      );
    }
  };

  return (
    <Box overflowY="auto">
      {messages.map(displayMessage)}
      {show && <Box ref={ref}></Box>}

      {/* {messages.map((message, idx) => (
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
      ))} */}
    </Box>
  );
};

export default ChatBody;
