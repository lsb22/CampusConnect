import { useEffect, useState } from "react";
import ChatBody from "./ChatBody";
import Navbar from "./Navbar";
import SidePanel from "./SidePanel";
import TypeMessage from "./TypeMessage";
import { Grid, GridItem, Show, useToast } from "@chakra-ui/react";
import { Socket } from "socket.io-client";
import useMessageStore from "../store/LatestMessagesStore";
import { useNavigate } from "react-router-dom";

interface Props {
  socket: Socket;
}

export interface MessageStruct {
  text: string;
  userName: string;
  socketId: string;
  id: string;
  _id?: string;
  _v?: number;
}

export interface UserStruct {
  username: string;
  socketId: string;
}

const ChatPage = ({ socket }: Props) => {
  const [messages, setMessages] = useState<MessageStruct[]>([]);
  const [users, setUsers] = useState<UserStruct[]>([]);
  const { messages: LatestMessages, isLoggedIn } = useMessageStore();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    socket.on("messageResponse", (data: MessageStruct) => {
      setMessages([...messages, data]);
    });

    socket.on("blocked", ({ message }) => {
      toast({
        title: message,
        description:
          "You can't use offensive languages!. If you repeat it once more, you will be blocked!. Keep that in mind you fool.",
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
    });

    socket.on("newUserLogin", (data: UserStruct[]) => {
      setUsers(data);
    });

    if (!isLoggedIn) {
      navigate("/");
    }
  }, [messages, socket]);

  return (
    <Grid
      templateAreas={{
        lg: `"sidePanel nav" "sidePanel main" "sidePanel message"`,
        base: `"nav" "main" "message"`,
      }}
      templateRows={{ lg: "60px 75vh 60px", base: "60px 75vh 60px" }}
      gap={3}
      p={3}
      height="100vh"
    >
      <GridItem area={"nav"} bg="rgb(6,6,7,0.18)" borderRadius="10px">
        <Navbar socket={socket} users={users} />
      </GridItem>
      <Show above={"lg"}>
        <GridItem area={"sidePanel"} bg="rgb(6,6,7,0.18)" borderRadius="10px">
          <SidePanel users={users} />
        </GridItem>
      </Show>
      <GridItem area={"main"} overflowY="scroll">
        <ChatBody
          messages={LatestMessages.map(
            (_, idx, arr) => arr[arr.length - idx - 1]
          )}
          socket={socket}
        />
        <ChatBody messages={messages} socket={socket} />
      </GridItem>
      <GridItem area={"message"} borderRadius="10px">
        <TypeMessage socket={socket} />
      </GridItem>
    </Grid>
  );
};

export default ChatPage;
