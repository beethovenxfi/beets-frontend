import { Highlight } from '@chakra-ui/react';

export function ReliquaryWithdrawDescription() {
    return (
        <>
            <Highlight query={['sit amet', 'tempor incididunt']} styles={{ fontWeight: 'bold', color: 'white' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
            </Highlight>
            <br />
            <br />
            <Highlight query={['sit amet', 'tempor incididunt']} styles={{ fontWeight: 'bold', color: 'white' }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
            </Highlight>
            <br />
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
        </>
    );
}
