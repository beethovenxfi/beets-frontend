import '@rainbow-me/rainbowkit/styles.css';
import 'swiper/css';
import 'swiper/css/pagination';
import '../styles/nprogress.css';
import '../styles/globals.css';

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
import { RainbowKitProvider, darkTheme, midnightTheme } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';
import { networkChainDefinitions, wagmiClient } from '~/lib/global/network';
import { BeetsFonts } from '~/components/fonts/BeetsFonts';
import { AppContent } from '~/pages/_app-content';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

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

const TopProgressBar = dynamic(
    () => {
        return import('../components/progress-bar/TopProgressBar');
    },
    { ssr: false },
);

function BeetsApp(props: AppProps) {
    const client = useApollo(props.pageProps);

    return (
        <WagmiProvider client={wagmiClient}>
            <RainbowKitProvider
                coolMode
                chains={networkChainDefinitions}
                showRecentTransactions={true}
                appInfo={{
                    appName: 'Beethoven X',
                    learnMoreUrl: 'https://docs.beets.fi',
                }}
                theme={darkTheme()}
            >
                <ApolloProvider client={client}>
                    <ChakraProvider theme={chakraTheme}>
                        <BeetsFonts />
                        <QueryClientProvider client={queryClient}>
                            <TopProgressBar />
                            <AppContent {...props} />
                        </QueryClientProvider>
                    </ChakraProvider>
                </ApolloProvider>
            </RainbowKitProvider>
        </WagmiProvider>
    );
}

export default BeetsApp;
