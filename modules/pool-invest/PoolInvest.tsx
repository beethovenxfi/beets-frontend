import { Container, Flex, Heading } from '@chakra-ui/react';
import { usePool } from '~/modules/pool/usePool';
import { useUserBalances } from '~/modules/global/useUserBalances';
import { useEffect } from 'react';
import PoolInvestTokensInWallet from '~/modules/pool-invest/PoolInvestTokensInWallet';

interface Props {
    poolId: string;
}

function PoolInvest({ poolId }: Props) {
    const { pool, allTokens, loading, error } = usePool(poolId);
    const { userBalances, loadUserBalances, getUserBalance, loadingUserBalances } = useUserBalances(
        allTokens.map((token) => token.address),
    );

    if (!pool) {
        return (
            <Container maxW="full">
                <Heading>Loading...</Heading>
            </Container>
        );
    }

    return (
        <Container maxW="full">
            <Flex>
                <PoolInvestTokensInWallet pool={pool} userBalances={userBalances} />
            </Flex>
        </Container>
    );
}

export default PoolInvest;
