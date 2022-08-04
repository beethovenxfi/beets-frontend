import { Text } from '@chakra-ui/react';

export function PoolInvestWeightedPoolDescription() {
    return (
        <>
            We recommend investing proportionally into this pool. This ensures you will{' '}
            <Text as="span" fontWeight="bold">
                NOT
            </Text>{' '}
            be subject to potential fees caused by price impact.
            <br />
            <br />
            Alternatively, you can customize and invest in this pool in any proportion. Investing in this manner,
            however, may shift the pool out of balance and is therefore subject to price impact.
            <br />
            <br />
            When investing in a liquidity pool, you will receive pool tokens (BPT) which represent your share of the
            pool.
        </>
    );
}
