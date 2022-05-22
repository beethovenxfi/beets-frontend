import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import { usePool } from '~/modules/pool/lib/usePool';
import { useUserBalances } from '~/lib/global/useUserBalances';
import PoolTokensInWallet from '~/modules/pool/components/PoolTokensInWallet';
import { tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import PoolMyPoolBalance from '~/modules/pool/components/PoolMyPoolBalance';
import PoolInvestForm from '~/modules/pool/invest/components/PoolInvestForm';
import { usePoolUserBalances } from '~/modules/pool/lib/usePoolUserBalances';

function PoolInvest() {
    const { pool, allTokens, allTokenAddresses } = usePool();
    const { userBalances, userBptBalance } = usePoolUserBalances();

    return (
        <Container maxW="full">
            <Flex alignItems="flex-start">
                <PoolTokensInWallet />
                <PoolInvestForm pool={pool} mx={8} flex={1} userBalances={userBalances} />
                <PoolMyPoolBalance pool={pool} userBptBalance={userBptBalance} />
            </Flex>
        </Container>
    );
}

export default PoolInvest;
