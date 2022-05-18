import { Container, Flex, Heading } from '@chakra-ui/react';
import { usePool } from '~/modules/pool/usePool';
import { useUserBalances } from '~/modules/global/useUserBalances';
import PoolTokensInWallet from '~/modules/pool-invest/PoolTokensInWallet';
import { tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import PoolMyPoolBalance from '~/modules/pool-invest/PoolMyPoolBalance';

interface Props {
    poolId: string;
}

function PoolInvest({ poolId }: Props) {
    const { pool, allTokens, loading, error } = usePool(poolId);
    const { userBalances, loadUserBalances, getUserBalance, loadingUserBalances } = useUserBalances(
        allTokens.map((token) => token.address),
        allTokens,
    );
    const userBptBalance = tokenGetAmountForAddress(pool?.address || '', userBalances);

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
                <PoolTokensInWallet pool={pool} userBalances={userBalances} />
                <PoolMyPoolBalance pool={pool} userBptBalance={userBptBalance} />
            </Flex>
        </Container>
    );
}

export default PoolInvest;
