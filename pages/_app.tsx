import '../styles/globals.css';

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { client } from '../apollo/client';
import { ApolloProvider } from '@apollo/client';

import { Box, ChakraProvider, extendTheme, VStack, Grid, GridItem } from '@chakra-ui/react';

/** Start charting library setup */
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';

import { LineChart, BarChart, PieChart, CandlestickChart, LinesChart } from 'echarts/charts';

import {
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
} from 'echarts/components';

import { CanvasRenderer } from 'echarts/renderers';

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

import FantomTheme from '~/styles/themes/fantom.json';
import Navbar from '~/components/nav/Navbar';

function MyApp({ Component, pageProps }: AppProps) {
    const theme = extendTheme(FantomTheme);
    return (
        <ApolloProvider client={client}>
            <ChakraProvider theme={theme}>
                <Box height="full" className="bg" fontFamily='Inter'>
                    <Box height="full" className="bg-gradient" display="flex" justifyContent="center">
                        {/* add gutter here */}
                        <Grid templateColumns="repeat(12, 1fr)" width="1400px" maxWidth="1400px" height='fit-content'>
                            <GridItem colSpan={12} height="fit-content">
                                <Navbar />
                            </GridItem>
                            <GridItem colSpan={12}>
                                <Component {...pageProps} />
                            </GridItem>
                        </Grid>
                    </Box>
                </Box>
            </ChakraProvider>
        </ApolloProvider>
    );
}

export default MyApp;
