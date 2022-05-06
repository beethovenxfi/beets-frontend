import { Box, ChakraProvider } from '@chakra-ui/react';

import '../styles/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ChakraProvider>
            <Box height="full">
                <Component {...pageProps} />
            </Box>
        </ChakraProvider>
    );
}

export default MyApp;
