import { Highlight } from '@chakra-ui/react';

export function PoolWithdrawStablePoolDescription() {
    return (
        <>
            <Highlight query={['single token without', 'price impact']} styles={{ fontWeight: 'bold', color: 'white' }}>
                Due to the unique design of stable pools, you can withdraw into a single token without encountering
                significant price impact.
            </Highlight>
            <br />
            <br />
            <Highlight query={['bonus', 'penalty']} styles={{ fontWeight: 'bold', color: 'white' }}>
                Withdraws that move the token balances closer to equal ratios will receive a small bonus, while
                withdraws that move the ratios further apart will incur a small penalty.
            </Highlight>
            <br />
            <br />
            When withdrawing from any liquidity pool, your BPT tokens are exchanged for the underlying pool assets.
        </>
    );
}
