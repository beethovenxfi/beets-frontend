// chakraTheme.ts

// 1. import `extendTheme` function
import { ComponentStyleConfig, extendTheme, ThemeConfig } from '@chakra-ui/react';
import { fantomTheme } from '~/styles/themes/fantomTheme';
import { optimismTheme } from '~/styles/themes/optimismTheme';

// 2. Add your color mode config
const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

const siteTheme = process.env.NEXT_PUBLIC_CHAIN_ID === '10' ? optimismTheme : fantomTheme;

// 3. extend the chakraTheme
export const chakraTheme = extendTheme({
    ...siteTheme,
    config,
    components: {
        ...siteTheme.components,
    },
});
