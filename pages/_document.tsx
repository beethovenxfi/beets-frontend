import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ColorModeScript } from '@chakra-ui/react';
import { chakraTheme } from '~/styles/chakraTheme';

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    {/*<link
                        href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
                        rel="stylesheet"
                    />*/}
                </Head>
                <body>
                    <ColorModeScript initialColorMode={chakraTheme.config.initialColorMode} />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
