import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import type { AppProps } from 'next/app';
import { useApollo } from '~/apollo/client';
import { ApolloProvider } from '@apollo/client';

import { Box, ChakraProvider, extendTheme, Grid, GridItem } from '@chakra-ui/react';

/** Start charting library setup */
import * as echarts from 'echarts/core';

import { BarChart, CandlestickChart, LineChart, LinesChart, PieChart } from 'echarts/charts';

import {
    AxisPointerComponent,
    BrushComponent,
    DatasetComponent,
    DataZoomComponent,
    DataZoomInsideComponent,
    DataZoomSliderComponent,
    GraphicComponent,
    GridComponent,
    GridSimpleComponent,
    LegendComponent,
    LegendPlainComponent,
    LegendScrollComponent,
    MarkAreaComponent,
    MarkLineComponent,
    MarkPointComponent,
    SingleAxisComponent,
    TimelineComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';
import FantomTheme from '~/styles/themes/fantom.json';
import Navbar from '~/components/nav/Navbar';
import { chakraTheme } from '~/styles/chakraTheme';
import { WagmiProvider } from 'wagmi';
import { wagmiClient, chains } from '~/components/wallet/WalletConnection';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

echarts.use([
    LineChart,
    BarChart,
    PieChart,
    CandlestickChart,
    LinesChart,
    GridSimpleComponent,
    GridComponent,
    SingleAxisComponent,
    GraphicComponent,
    ToolboxComponent,
    TooltipComponent,
    AxisPointerComponent,
    BrushComponent,
    TitleComponent,
    TimelineComponent,
    MarkPointComponent,
    MarkLineComponent,
    MarkAreaComponent,
    LegendComponent,
    LegendScrollComponent,
    LegendPlainComponent,
    DataZoomComponent,
    DataZoomInsideComponent,
    DataZoomSliderComponent,
    DatasetComponent,
    CanvasRenderer,
]);

/** End charting library setup */

function MyApp({ Component, pageProps }: AppProps) {
    const client = useApollo(pageProps);
    const router = useRouter();

    /*useEffect(() => {
        const handleStart = (url: string) => {
            console.log(`Loading: ${url}`);
            // NProgress.start()
            //setPageChanged(true);
        };
        const handleStop = () => {
            console.log(`end`);
            //setPageChanged(false);
        };

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleStop);
        router.events.on('routeChangeError', handleStop);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleStop);
            router.events.off('routeChangeError', handleStop);
        };
    }, [router]);*/

    return (
        <WagmiProvider client={wagmiClient}>
            <RainbowKitProvider coolMode chains={chains}>
                <ApolloProvider client={client}>
                    <ChakraProvider theme={chakraTheme}>
                        <Box height="full" className="bg" fontFamily="Inter" overflowX="hidden">
                            <Box height="full" display="flex" justifyContent="center">
                                {/* add gutter here */}
                                <Grid
                                    templateColumns="repeat(12, 1fr)"
                                    width="1400px"
                                    maxWidth="1400px"
                                    height="fit-content"
                                >
                                    <GridItem colSpan={12} height="fit-content">
                                        <Navbar />
                                    </GridItem>
                                    <GridItem colSpan={12} paddingTop="12">
                                        <Component {...pageProps} />
                                    </GridItem>
                                </Grid>
                            </Box>
                        </Box>
                    </ChakraProvider>
                </ApolloProvider>
            </RainbowKitProvider>
        </WagmiProvider>
    );
}

export default MyApp;
