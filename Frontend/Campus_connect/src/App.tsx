import "./App.css";
import Navbar from "./components/Navbar";
import { Grid, GridItem, Show } from "@chakra-ui/react";

function App() {
  return (
    <Grid
      templateAreas={{
        lg: `"sidePanel nav" "sidePanel main" "sidePanel search"`,
        base: `"nav" "main" "search"`,
      }}
    >
      <GridItem area={"nav"}>
        <Navbar />
      </GridItem>
      <Show above={"lg"}>
        <GridItem area={"sidePanel"} bg="pink.300">
          sidepanel
        </GridItem>
      </Show>
      <GridItem area={"main"} bg="green.300">
        Main
      </GridItem>
      <GridItem area={"search"} bg="blue.300">
        search
      </GridItem>
    </Grid>
  );
}

export default App;
