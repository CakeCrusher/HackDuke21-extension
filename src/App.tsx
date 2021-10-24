import { ChakraProvider, DarkMode, Flex } from "@chakra-ui/react";
import React from "react";
import "./App.css";
import AppContainer from "./components/AppContainer";

const App = (): JSX.Element => {
  return (
    <ChakraProvider>
      <DarkMode>
        <Flex
          bgColor="gray.900"
          color="white"
          direction="column"
          rounded="sm"
          shadow="lg"
          w="400px"
          h="full"
        >
          <AppContainer />
        </Flex>
      </DarkMode>
    </ChakraProvider>
  );
};

export default App;
