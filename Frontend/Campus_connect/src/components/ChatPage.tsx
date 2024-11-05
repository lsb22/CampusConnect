import { useState } from "react";
import ChatBody from "./ChatBody";
import Navbar from "./Navbar";
import SidePanel from "./SidePanel";
import TypeMessage from "./TypeMessage";
import { Grid, GridItem, Show } from "@chakra-ui/react";

const ChatPage = () => {
  const [messages, setMessages] = useState([] as string[]);
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
        <ChatBody messages={messages} />
      </GridItem>
      <GridItem area={"message"} borderRadius="10px">
        <TypeMessage
          sendMessage={(message) => setMessages([...messages, message])}
        />
      </GridItem>
    </Grid>
  );
};

export default ChatPage;
