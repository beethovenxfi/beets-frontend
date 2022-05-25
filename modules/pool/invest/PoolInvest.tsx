import { Container, Flex } from '@chakra-ui/react';
import PoolTokensInWallet from '~/modules/pool/components/PoolTokensInWallet';
import PoolMyPoolBalance from '~/modules/pool/components/PoolMyPoolBalance';
import PoolInvestForm from '~/modules/pool/invest/components/PoolInvestForm';

function PoolInvest() {
    return (
        <Container maxW="full">
            <Flex alignItems="flex-start">
                <PoolTokensInWallet />
                <PoolInvestForm mx={8} flex={1} />
                <PoolMyPoolBalance />
            </Flex>
        </Container>
    );
}

export default PoolInvest;
