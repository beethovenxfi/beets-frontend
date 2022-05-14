// chakraTheme.ts

// 1. import `extendTheme` function
import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import FantomTheme from '~/styles/themes/fantom.json';

// 2. Add your color mode config
const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

// 3. extend the chakraTheme
export const chakraTheme = extendTheme({ ...FantomTheme, config });
