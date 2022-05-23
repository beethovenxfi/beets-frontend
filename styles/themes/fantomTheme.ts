import { ChakraTheme } from '@chakra-ui/theme';

export const fantomTheme: Partial<ChakraTheme> = {
    fonts: {
        heading: `'Gotham', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
        body: `'Gotham', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
    },
    textStyles: {
        h1: {
            fontSize: ['3.6rem'],
            lineHeight: '100%',
            fontWeight: 'bold',
            letterSpacing: '-0.1rem',
        },
        h2: {
            fontSize: ['2.7rem'],
            fontWeight: '300',
            lineHeight: '100%',
            letterSpacing: '-0.1rem',
        },
        h3: {
            fontSize: ['1.8rem'],
            fontWeight: '300',
            lineHeight: '115%',
            letterSpacing: '-0.05rem',
        },
        h4: {
            fontSize: ['1.8rem'],
            fontWeight: '300',
            lineHeight: '115%',
            letterSpacing: '-0.05rem',
        },
        h5: {
            fontSize: ['1.2rem'],
            fontWeight: '300',
            lineHeight: '115%',
            letterSpacing: '-0.03rem',
        },
        h6: {
            fontSize: ['1.2rem'],
            fontWeight: '300',
            lineHeight: '115%',
            letterSpacing: '-0.03rem',
        },
    },
    colors: {
        beets: {
            green: {
                '900': '#020C09',
                '800': '#205143',
                '700': '#0A6A4F',
                '600': '#0D936D',
                '500': '#0CB686',
                '400': '#01F3AF',
                '300': '#CCFFCC',
                '200': '#74F8D3',
                '100': '#CDFFF1',
                alpha: {
                    '100': 'rgba(0,248,156, 1.0)',
                    '200': 'rgba(0,248,156, 0.5)',
                    '300': 'rgba(0,248,156, 0.2)',
                    '400': 'rgba(0,248,156, 0.1)',
                    '500': 'rgba(0,248,156, 0.05)',
                },
            },
            red: {
                '300': '#FF0000',
                alpha: {
                    '100': 'rgba(255,0,0, 1.0)',
                    '200': 'rgba(255,0,0, 0.5)',
                    '300': 'rgba(255,0,0, 0.2)',
                    '400': 'rgba(255,0,0, 0.1)',
                    '500': 'rgba(255,0,0, 0.05)',
                },
            },
            navy: {
                '800': '#05050C',
                '700': '#151533',
                '600': '#22225B',
                '500': '#272785',
                '400': '#2C2CE6',
                '300': '#5959E4',
            },
            gray: {
                '800': '#090911',
                '700': '#10101E',
                '600': '#141423',
                '500': '#212138',
                '400': '#33334A',
                '300': '#54546C',
                '200': '#757584',
                '100': '#C1C1D1',
            },
            highlight: {
                alpha: {
                    '100': 'rgba(0,255,255, 1.0)',
                    '200': 'rgba(0,255,255, 0.5)',
                    '300': 'rgba(0,255,255, 0.2)',
                    '400': 'rgba(0,255,255, 0.1)',
                    '500': 'rgba(0,255,255, 0.05)',
                },
            },
            base: {
                '500': 'rgb(46,49,146)',
                '600': 'rgb(27,20,100)',
                '700': 'rgb(18,14,68)',
                '800': 'rgb(8,6,31)',
                light: {
                    alpha: {
                        '100': 'rgba(46,49,146, 1.0)',
                        '200': 'rgba(46,49,146, 0.5)',
                        '300': 'rgba(46,49,146, 0.2)',
                        '400': 'rgba(46,49,146, 0.1)',
                        '500': 'rgba(46,49,146, 0.05)',
                    },
                },
                base: {
                    alpha: {
                        '100': 'rgba(27,20,100, 1.0)',
                        '200': 'rgba(27,20,100, 0.5)',
                        '300': 'rgba(27,20,100, 0.2)',
                        '400': 'rgba(27,20,100, 0.05)',
                    },
                },
                mid: {
                    alpha: {
                        '100': 'rgba(18,14,68, 1.0)',
                        '200': 'rgba(18,14,68, 0.5)',
                        '300': 'rgba(18,14,68, 0.2)',
                        '400': 'rgba(18,14,68, 0.1)',
                        '500': 'rgba(18,14,68, 0.05)',
                    },
                },
                dark: {
                    alpha: {
                        '100': 'rgba(8,6,31, 1.0)',
                        '200': 'rgba(8,6,31, 0.5)',
                        '300': 'rgba(8,6,31, 0.2)',
                        '400': 'rgba(8,6,31, 0.1)',
                        '500': 'rgba(8,6,31, 0.05)',
                    },
                },
            },
        },
    },
};
