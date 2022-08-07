import { Highlight } from '@chakra-ui/react';

export function PoolInvestWeightedPoolDescription() {
    return (
        <>
            <Highlight
                query={['Investing proportionally', 'not', 'price impact']}
                styles={{ fontWeight: 'bold', color: 'white' }}
            >
                Investing proportionally into this pool ensures you will not be subject to the fees associated with
                price impact.
            </Highlight>
            <br />
            <br />
            <Highlight
                query={['customize your investment', 'price impact']}
                styles={{ fontWeight: 'bold', color: 'white' }}
            >
                Alternatively, you can customize your investment and deposit in this pool with any tokens in your
                wallet. However, investing in this manner may shift the pool out of balance and is therefore subject to
                price impact.
            </Highlight>
            <br />
            <br />
            When investing in any liquidity pool, you will receive pool tokens (BPT) which represent your share of the
            pool.
        </>
    );
}
