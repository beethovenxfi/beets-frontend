import { Highlight } from '@chakra-ui/react';

export function PoolInvestStablePoolDescription() {
    return (
        <>
            <Highlight query={['custom asset ratios']} styles={{ fontWeight: 'bold', color: 'white' }}>
                Stable pools allow you to invest with custom asset ratios without encountering significant price impact.
            </Highlight>
            <br />
            <br />
            <Highlight query={['bonus', 'penalty']} styles={{ fontWeight: 'bold', color: 'white' }}>
                Deposits that move the token balances closer to equal ratios will receive a small bonus, while deposits
                that move the ratios further apart will incur a small penalty.
            </Highlight>
            <br />
            <br />

            <Highlight query={['impermanent loss']} styles={{ fontWeight: 'bold', color: 'white' }}>
                In instances where one asset in the pool loses its peg, it&apos;s possible to incur severe impermanent
                loss.
            </Highlight>
        </>
    );
}
