import { useEffect, useState } from "react";
import ChatBody from "./ChatBody";
import Navbar from "./Navbar";
import SidePanel from "./SidePanel";
import TypeMessage from "./TypeMessage";
import { Grid, GridItem, Show } from "@chakra-ui/react";
import { Socket } from "socket.io-client";
import useMessageStore from "../store/LatestMessagesStore";

interface Props {
  socket: Socket;
}

export interface MessageStruct {
  text: string;
  userName: string;
  socketId: string;
  id: string;
}

const ChatPage = ({ socket }: Props) => {
  const [messages, setMessages] = useState<MessageStruct[]>([]);
  const { messages: LatestMessages } = useMessageStore();

  useEffect(() => {
    socket.on("messageResponse", (data: MessageStruct) => {
      setMessages([...messages, data]);
    });
  }, [messages, socket]);

  return (
    <Grid
      templateAreas={{
        lg: `"sidePanel nav" "sidePanel main" "sidePanel message"`,
        base: `"nav" "main" "message"`,
      }}
      templateRows={{ lg: "60px 78vh 60px", base: "60px 78vh 60px" }}
      gap={3}
      p={3}
      height="100vh"
    >
      <GridItem area={"nav"} bg="rgb(6,6,7,0.18)" borderRadius="10px">
        <Navbar />
      </GridItem>
      <Show above={"lg"}>
        <GridItem area={"sidePanel"} bg="rgb(6,6,7,0.18)" borderRadius="10px">
          <SidePanel />
        </GridItem>
      </Show>
      <GridItem area={"main"} overflowY="scroll">
        <ChatBody
          messages={LatestMessages.map(
            (_, idx, arr) => arr[arr.length - idx - 1]
          )}
        />
        <ChatBody messages={messages} />
      </GridItem>
      <GridItem area={"message"} borderRadius="10px">
        <TypeMessage socket={socket} />
      </GridItem>
    </Grid>
  );
};

export default ChatPage;
