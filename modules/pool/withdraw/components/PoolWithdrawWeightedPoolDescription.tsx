import { Highlight } from '@chakra-ui/react';

export function PoolWithdrawWeightedPoolDescription() {
    return (
        <>
            <Highlight
                query={['Withdrawing proportionally', 'not', 'price impact']}
                styles={{ fontWeight: 'bold', color: 'white' }}
            >
                Withdrawing proportionally from this pool ensures you will not be subject to the potential fees caused
                by price impact.
            </Highlight>
            <br />
            <br />
            <Highlight query={['single asset', 'not', 'price impact']} styles={{ fontWeight: 'bold', color: 'white' }}>
                Alternatively, you can withdraw a single asset. This is similar to swapping all other assets for the
                selected asset, and is therefore subject to the fees associated with price impact.
            </Highlight>
            <br />
            <br />
            When withdrawing from any liquidity pool, your BPT tokens are exchanged for the underlying pool assets.
        </>
    );
}
