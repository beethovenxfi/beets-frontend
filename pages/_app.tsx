import { Box, ChakraProvider, extendTheme, VStack } from "@chakra-ui/react";

import "../styles/globals.css";
import type { AppProps } from "next/app";

import FantomTheme from "~/styles/themes/fantom.json";
import Navbar from "~/components/nav/Navbar";

function MyApp({ Component, pageProps }: AppProps) {
  const theme = extendTheme(FantomTheme);
  return (
    <ChakraProvider theme={theme}>
      <Box height="full" className="bg">
        <Box height="full" className="bg-gradient">
          <VStack width="full">
            <Navbar />
            <Component {...pageProps} />
          </VStack>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default MyApp;
