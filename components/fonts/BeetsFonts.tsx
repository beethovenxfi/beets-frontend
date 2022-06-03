import { Global } from '@emotion/react';

export function BeetsFonts() {
    return (
        <Global
            styles={`
                @font-face {
                    font-family: 'Gotham';
                    src: url('/fonts/gotham-light-webfont.woff2') format('woff2'),
                        url('/fonts/gotham-light-webfont.woff') format('woff');
                    font-weight: 300;
                    font-style: normal;
                }
                
                @font-face {
                    font-family: 'Gotham';
                    src: url('/fonts/gotham-book-webfont.woff2') format('woff2'),
                        url('/fonts/gotham-book-webfont.woff') format('woff');
                    font-weight: 500;
                    font-style: normal;
                }
                
                @font-face {
                    font-family: 'Gotham';
                    src: url('/fonts/gotham-medium-webfont.woff2') format('woff2'),
                        url('/fonts/gotham-medium-webfont.woff') format('woff');
                    font-weight: 700;
                    font-style: normal;
                }
                
                @font-face {
                    font-family: 'Gotham';
                    src: url('/fonts/gotham-bold-webfont.woff2') format('woff2'),
                        url('/fonts/gotham-bold-webfont.woff') format('woff');
                    font-weight: 900;
                    font-style: normal;
                }
            `}
        />
    );
}
