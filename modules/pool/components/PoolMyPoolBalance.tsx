import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';
import numeral from 'numeral';
import { usePool } from '~/modules/pool/lib/usePool';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';

interface Props {}

function PoolTokensInWallet({}: Props) {
    const { formattedPrice } = useGetTokens();
    const { data } = usePoolUserDepositBalance();
    const { pool } = usePool();

    return (
        <Container bg="gray.900" shadow="lg" rounded="lg" padding="4" mb={12} maxW="350">
            <Heading fontSize="md" mb={4}>
                My pool balance
            </Heading>
            {pool.tokens.map((poolToken, index) => {
                const userBalance = data?.find((balance) => balance.address === poolToken.address)?.amount || '0';

                return (
                    <Box key={`token-${index}`}>
                        <Flex mb={2} alignItems="center">
                            <Box>
                                {poolToken.symbol} - {tokenFormatAmount(userBalance)}
                                <br />
                                {formattedPrice({ address: poolToken.address, amount: `${userBalance}` })}
                            </Box>
                        </Flex>
                    </Box>
                );
            })}
        </Container>
    );
}

export default PoolTokensInWallet;
