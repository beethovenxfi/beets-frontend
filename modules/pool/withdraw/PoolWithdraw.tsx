import { Container, Flex, Heading } from '@chakra-ui/react';
import { usePool } from '~/modules/pool/lib/usePool';
import { useUserBalances } from '~/lib/global/useUserBalances';
import PoolTokensInWallet from '~/modules/pool/components/PoolTokensInWallet';
import { tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import PoolMyPoolBalance from '~/modules/pool/components/PoolMyPoolBalance';
import PoolWithdrawForm from '~/modules/pool/withdraw/components/PoolWithdrawForm';

function PoolInvest() {
    const { pool, allTokens, allTokenAddresses } = usePool();
    const { userBalances, loadingUserBalances } = useUserBalances(allTokenAddresses, allTokens);
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
            <Flex alignItems="flex-start">
                <PoolTokensInWallet pool={pool} userBalances={userBalances} />
                <PoolWithdrawForm pool={pool} mx={8} flex={1} userBalances={userBalances} />
                <PoolMyPoolBalance pool={pool} userBptBalance={userBptBalance} />
            </Flex>
        </Container>
    );
}

export default PoolInvest;
