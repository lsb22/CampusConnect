import { Grid, GridItem, Show } from "@chakra-ui/react";
import Navbar from "./Navbar";
import SidePanel from "./SidePanel";
import TypeMessage from "./TypeMessage";

const ChatPage = () => {
  return (
    <Grid
      templateAreas={{
        lg: `"sidePanel nav" "sidePanel main" "sidePanel message"`,
        base: `"nav" "main" "message"`,
      }}
      templateRows={{ lg: "60px 1fr 60px", base: "60px 1fr 60px" }}
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
      <GridItem area={"main"}>Main</GridItem>
      <GridItem area={"message"} borderRadius="10px">
        <TypeMessage />
      </GridItem>
    </Grid>
  );
};

export default ChatPage;
