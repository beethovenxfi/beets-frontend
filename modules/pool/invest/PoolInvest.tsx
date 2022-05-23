import { Container, Flex } from '@chakra-ui/react';
import { usePool } from '~/modules/pool/lib/usePool';
import PoolTokensInWallet from '~/modules/pool/components/PoolTokensInWallet';
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
                <PoolMyPoolBalance />
            </Flex>
        </Container>
    );
}

export default PoolInvest;
