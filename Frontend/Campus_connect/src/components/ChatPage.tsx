import { useEffect, useState } from "react";
import ChatBody from "./ChatBody";
import Navbar from "./Navbar";
import SidePanel from "./SidePanel";
import TypeMessage from "./TypeMessage";
import { Grid, GridItem, Show, useToast } from "@chakra-ui/react";
import { Socket } from "socket.io-client";
import useMessageStore from "../store/LatestMessagesStore";
import { useNavigate } from "react-router-dom";
import calculateDistance from "../services/CalculateDistance";

interface Props {
  socket: Socket;
}

export interface MessageStruct {
  text?: string;
  userName: string;
  socketId: string;
  id: string;
  _id?: string;
  _v?: number;
  file?: boolean;
  mimeType?: string;
  fileName?: string;
  body?: File;
  time: Date;
}

export interface UserStruct {
  username: string;
  socketId: string;
  users_latitude: number;
  users_longitude: number;
}

const ChatPage = ({ socket }: Props) => {
  const [messages, setMessages] = useState<MessageStruct[]>([]);
  const [users, setUsers] = useState<UserStruct[]>([]);
  const [blocked_users, setBlockedUsers] = useState<string[]>([]);
  const {
    messages: LatestMessages,
    isLoggedIn,
    users_latitude,
    users_longitude,
  } = useMessageStore();
  const navigate = useNavigate();
  const toast = useToast();

  const submitRange = (range: number) => {
    setBlockedUsers([]);
    const arr_blocked: string[] = [];
    for (const user of users) {
      if (user.username !== socket.username) {
        const dist = Math.round(
          calculateDistance(
            users_latitude,
            users_longitude,
            user.users_latitude,
            user.users_longitude
          )
        );
        // calculateDistance returns straight line distance (which is like radius
        // of a circle). It doesn't return road distance.
        if (dist > range) {
          // setBlockedUsers([...blocked_users, user.username])
          arr_blocked.push(user.username);
        }
      }
    }

    setBlockedUsers(arr_blocked);
  };

  LatestMessages?.sort((a, b) => {
    const d1 = new Date(a.time);
    const d2 = new Date(b.time);
    return d2.getTime() - d1.getTime();
  });

  useEffect(() => {
    const handleMessageResponse = (data: MessageStruct) => {
      setMessages([...messages, data]);
    };

    const hanldeBlockedMessages = ({ message }: { message: string }) => {
      toast({
        title: message,
        description:
          "You can't use offensive languages!. If you repeat it once more, you will be blocked!.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    };

    const handleNewUserLogin = (data: UserStruct[]) => {
      setUsers(data);
    };

    const handleLocationUpdate = (data: UserStruct[]) => {
      setUsers(data);
    };

    socket.on("messageResponse", handleMessageResponse);
    socket.on("blocked", hanldeBlockedMessages);
    socket.on("newUserLogin", handleNewUserLogin);
    socket.on("updatedUserLocation", handleLocationUpdate);

    if (!isLoggedIn) {
      navigate("/");
    }

    return () => {
      socket.off("messageResponse", handleMessageResponse);
      socket.off("blocked", hanldeBlockedMessages);
      socket.off("newUserLogin", handleNewUserLogin);
      socket.off("updatedUserLocation", handleLocationUpdate);
    };
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
      <GridItem
        area={"nav"}
        bg="rgb(6,6,7,0.18)"
        borderRadius="10px"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Navbar socket={socket} users={users} />
      </GridItem>
      <Show above={"lg"}>
        <GridItem area={"sidePanel"} bg="rgb(6,6,7,0.18)" borderRadius="10px">
          <SidePanel
            users={users.filter(
              (user) => !blocked_users.includes(user.username)
            )}
          />
        </GridItem>
      </Show>
      <GridItem area={"main"} overflowY="scroll">
        <ChatBody
          messages={LatestMessages.map(
            (_, idx, arr) => arr[arr.length - idx - 1]
          )}
          socket={socket}
          blocked_users={blocked_users}
        />
        <ChatBody
          messages={messages}
          socket={socket}
          show={true}
          submitRange={submitRange}
          blocked_users={blocked_users}
        />
      </GridItem>
      <GridItem
        area={"message"}
        borderRadius="10px"
        className="message-component"
      >
        <TypeMessage socket={socket} />
      </GridItem>
    </Grid>
  );
};

export default ChatPage;
