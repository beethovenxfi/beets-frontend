import { Box, ChakraProvider } from '@chakra-ui/react';

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { client } from '../apollo/client';
import { ApolloProvider } from '@apollo/client';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <ApolloProvider client={client}>
            <ChakraProvider>
                <Box height="full">
                    <Component {...pageProps} />
                </Box>
            </ChakraProvider>
        </ApolloProvider>
    );
}

export default MyApp;
