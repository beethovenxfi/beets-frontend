import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import { usePool } from '~/modules/pool/lib/usePool';
import { useUserBalances } from '~/lib/global/useUserBalances';
import PoolTokensInWallet from '~/modules/pool/components/PoolTokensInWallet';
import { tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import PoolMyPoolBalance from '~/modules/pool/components/PoolMyPoolBalance';
import PoolInvestForm from '~/modules/pool/invest/components/PoolInvestForm';

function PoolInvest() {
    const { pool, allTokens, allTokenAddresses } = usePool();
    const { userBalances, loadingUserBalances } = useUserBalances(allTokenAddresses, allTokens);
    const userBptBalance = tokenGetAmountForAddress(pool?.address || '', userBalances);

    return (
        <Container maxW="full">
            <Flex alignItems="flex-start">
                <PoolTokensInWallet pool={pool} userBalances={userBalances} />
                <PoolInvestForm pool={pool} mx={8} flex={1} userBalances={userBalances} />
                <PoolMyPoolBalance pool={pool} userBptBalance={userBptBalance} />
            </Flex>
        </Container>
    );
}

export default PoolInvest;
