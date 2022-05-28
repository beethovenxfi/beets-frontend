import { Container, Flex } from '@chakra-ui/react';
import PoolTokensInWallet from '~/modules/pool/components/PoolTokensInWallet';
import PoolMyPoolBalance from '~/modules/pool/components/PoolMyPoolBalance';
import PoolInvestActions from '~/modules/pool/invest/components/PoolInvestActions';

function PoolInvest() {
    return (
        <Container maxW="full">
            <Flex alignItems="flex-start">
                <PoolTokensInWallet />
                <PoolInvestActions />
                <PoolMyPoolBalance />
            </Flex>
        </Container>
    );
}

export default PoolInvest;
