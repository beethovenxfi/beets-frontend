import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';
import 'swiper/css';
import 'swiper/css/pagination';

import type { AppProps } from 'next/app';
import { useApollo } from '~/apollo/client';
import { ApolloProvider } from '@apollo/client';

import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
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
import { chakraTheme } from '~/styles/chakraTheme';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';
import { networkChainDefinitions, wagmiClient } from '~/lib/global/network';
import { BeetsFonts } from '~/components/fonts/BeetsFonts';
import { AppContent } from '~/pages/_app-content';

const queryClient = new QueryClient();

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

function BeetsApp(props: AppProps) {
    const client = useApollo(props.pageProps);
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
            <RainbowKitProvider coolMode chains={networkChainDefinitions} showRecentTransactions={true}>
                <ApolloProvider client={client}>
                    <ChakraProvider theme={chakraTheme}>
                        <BeetsFonts />
                        <QueryClientProvider client={queryClient}>
                            <AppContent {...props} />
                        </QueryClientProvider>
                    </ChakraProvider>
                </ApolloProvider>
            </RainbowKitProvider>
        </WagmiProvider>
    );
}

export default BeetsApp;
