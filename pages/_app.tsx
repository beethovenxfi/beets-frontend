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
import { WagmiConfig } from 'wagmi';
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { networkChainDefinitions, wagmiClient } from '~/lib/global/network';
import { BeetsFonts } from '~/components/fonts/BeetsFonts';
import { AppContent } from '~/pages/_app-content';
import dynamic from 'next/dynamic';
import { WalletUserAvatar } from '~/components/avatar/WalletUserAvatar';
import Compose, { ProviderWithProps } from '~/components/providers/Compose';
import { TokensProvider } from '~/lib/global/useToken';
import { UserDataProvider } from '~/lib/user/useUserData';
import BeetsToast from '~/components/toast/BeetsToast';

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

const TopProgressBar = dynamic(
    function TopProgressBarFunc() {
        return import('../components/progress-bar/TopProgressBar');
    },
    { ssr: false },
);

function BeetsApp(props: AppProps) {
    const client = useApollo(props.pageProps);

    const AppProviders: ProviderWithProps[] = [
        [TokensProvider, {}],
        [UserDataProvider, {}],
    ];

    return (
        <ChakraProvider theme={chakraTheme}>
            <QueryClientProvider client={queryClient}>
                <WagmiConfig client={wagmiClient}>
                    <RainbowKitProvider
                        coolMode
                        chains={networkChainDefinitions}
                        showRecentTransactions={true}
                        appInfo={{ appName: 'Beethoven X', learnMoreUrl: 'https://docs.beets.fi' }}
                        theme={darkTheme()}
                        avatar={() => <WalletUserAvatar />}
                    >
                        <ApolloProvider client={client}>
                            <BeetsToast>
                                <Compose providers={AppProviders}>
                                    <BeetsFonts />
                                    <TopProgressBar />
                                    <AppContent {...props} />
                                </Compose>
                            </BeetsToast>
                        </ApolloProvider>
                    </RainbowKitProvider>
                </WagmiConfig>
            </QueryClientProvider>
        </ChakraProvider>
    );
}

export default BeetsApp;
