import { Container, Flex } from '@chakra-ui/react';
import PoolTokensInWallet from '~/modules/pool/components/PoolTokensInWallet';
import PoolMyPoolBalance from '~/modules/pool/components/PoolMyPoolBalance';
import PoolWithdrawForm from '~/modules/pool/withdraw/components/PoolWithdrawForm';
import { PoolWithdrawActions } from '~/modules/pool/withdraw/components/PoolWithdrawActions';

function PoolWithdraw() {
    return (
        <Container maxW="full">
            <Flex alignItems="flex-start">
                <PoolTokensInWallet />
                <PoolWithdrawActions />
                {/* <PoolWithdrawForm mx={8} flex={1} />*/}
                <PoolMyPoolBalance />
            </Flex>
        </Container>
    );
}

export default PoolWithdraw;
