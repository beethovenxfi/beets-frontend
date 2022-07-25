// chakraTheme.ts

// 1. import `extendTheme` function
import { ComponentStyleConfig, extendTheme, ThemeConfig } from '@chakra-ui/react';
import { fantomTheme } from '~/styles/themes/fantomTheme';

// 2. Add your color mode config
const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

// 3. extend the chakraTheme
export const chakraTheme = extendTheme({
    ...fantomTheme,
    config,
    components: {
        ...fantomTheme.components,
    },
});
