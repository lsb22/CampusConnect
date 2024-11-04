import "./App.css";
import Navbar from "./components/Navbar";
import { Grid, GridItem, Show } from "@chakra-ui/react";
import SidePanel from "./components/SidePanel";

function App() {
  return (
    <Grid
      templateAreas={{
        lg: `"sidePanel nav" "sidePanel main" "sidePanel search"`,
        base: `"nav" "main" "search"`,
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
      <GridItem area={"search"} bg="rgba(6,6,7,0.18)" borderRadius="10px">
        search
      </GridItem>
    </Grid>
  );
}

export default App;
