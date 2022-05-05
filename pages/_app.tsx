import "../styles/globals.css";
import type { AppProps } from "next/app";

import { Box, ChakraProvider, extendTheme, VStack } from "@chakra-ui/react";

/** Start charting library setup */
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";

import {
  LineChart,
  BarChart,
  PieChart,
  CandlestickChart,
  LinesChart,
} from "echarts/charts";

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
} from "echarts/components";

import { CanvasRenderer } from "echarts/renderers";

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
