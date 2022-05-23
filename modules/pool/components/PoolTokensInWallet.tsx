import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import { useGetTokens } from '~/lib/global/useToken';
import { tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import numeral from 'numeral';
import { usePoolUserBalances } from '~/modules/pool/lib/usePoolUserBalances';
import { usePool } from '~/modules/pool/lib/usePool';

function PoolTokensInWallet() {
    const { priceFor } = useGetTokens();
    const { userBalances } = usePoolUserBalances();
    const { pool } = usePool();

    return (
        <Container bg="gray.900" shadow="lg" rounded="lg" padding="4" mb={12} maxW="350">
            <Heading fontSize="md" mb={4}>
                Pool tokens in my wallet
            </Heading>
            {pool.investConfig.options.map((option, index) => {
                return (
                    <Box key={index}>
                        {option.tokenOptions.map((tokenOption, index) => {
                            const userBalance = tokenGetAmountForAddress(tokenOption.address, userBalances);

                            return (
                                <Flex key={`token-${index}`} mb={2} alignItems="center">
                                    <Box>
                                        {tokenOption.symbol} - {userBalance}
                                        <br />
                                        {numeral(priceFor(tokenOption.address) * parseFloat(userBalance)).format(
                                            '$0,0.00',
                                        )}
                                    </Box>
                                </Flex>
                            );
                        })}
                    </Box>
                );
            })}
        </Container>
    );
}

export default PoolTokensInWallet;
