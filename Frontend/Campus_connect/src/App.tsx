import { Grid, GridItem, Show } from "@chakra-ui/react";
import "./App.css";

function App() {
  return (
    <Grid
      templateAreas={{
        lg: `"nav nav" "sidePanel main" "sidePanel search"`,
        base: `"nav" "main" "search"`,
      }}
    >
      <GridItem area={"nav"} bgColor="teal">
        Navbar
      </GridItem>
      <Show above={"lg"}>
        <GridItem area={"sidePanel"} bgColor="blue.300">
          sidepanel
        </GridItem>
      </Show>
      <GridItem area={"main"} bgColor="blue.500">
        Main
      </GridItem>
      <GridItem area={"search"} bgColor="lightcoral">
        search
      </GridItem>
    </Grid>
  );
}

export default App;
