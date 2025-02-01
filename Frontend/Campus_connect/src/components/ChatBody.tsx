import {
  Box,
  Flex,
  Text,
  VStack,
  Image,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { MessageStruct } from "./ChatPage";
import { Socket } from "socket.io-client";
import RenderImage from "./RenderImage";
import { useEffect, useRef } from "react";
import arrow from "../assets/images/down-arrows.png";

interface Props {
  messages: MessageStruct[];
  socket: Socket;
  show?: boolean;
  submitRange?: (range: number) => void;
  blocked_users: string[];
}

const ChatBody = ({
  messages,
  socket,
  show,
  submitRange,
  blocked_users,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleclick = () => {
    if (ref.current) ref.current.scrollIntoView();
  };

  useEffect(() => {
    if (ref.current) ref.current.scrollIntoView();
  }, [messages]);

  const displayMessage = (message: MessageStruct, idx: number) => {
    if (blocked_users.includes(message.userName)) return null;
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

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rangeRef.current) {
      submitRange!(parseInt(rangeRef.current.value));
    }
  };

  return (
    <Box overflowY="auto">
      {messages.map(displayMessage)}
      {show && <Box ref={ref}></Box>}
      {show && (
        <Button
          className="arrow-down"
          variant="outline"
          position="fixed"
          bgColor="white"
          onClick={handleclick}
        >
          <Image className="arrow-img" src={arrow} />
        </Button>
      )}
      {show && (
        <Button className="range-setter" position="fixed" onClick={onOpen}>
          Range
        </Button>
      )}
      {show && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Visibility Range</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form onSubmit={handleFormSubmit}>
                <FormControl>
                  <FormLabel>Range in KM</FormLabel>
                  <Input placeholder="Enter the radius" ref={rangeRef} />
                </FormControl>
                <Flex justifyContent="end">
                  <Button
                    type="submit"
                    onClick={onClose}
                    colorScheme="blue"
                    mt={6}
                  >
                    Submit
                  </Button>
                </Flex>
              </form>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default ChatBody;
