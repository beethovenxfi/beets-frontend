import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';
import numeral from 'numeral';
import { usePoolUserBalances } from '~/modules/pool/lib/usePoolUserBalances';
import { usePool } from '~/modules/pool/lib/usePool';

interface Props {
    pool: GqlPoolUnion;
    userBptBalance: string;
}

function PoolTokensInWallet({}: Props) {
    const { priceFor } = useGetTokens();
    const { userPercentShare } = usePoolUserBalances();
    const { poolTokensWithoutPhantomBpt } = usePool();

    return (
        <Container bg="gray.900" shadow="lg" rounded="lg" padding="4" mb={12} maxW="350">
            <Heading fontSize="md" mb={4}>
                My pool balance
            </Heading>
            {poolTokensWithoutPhantomBpt.map((poolToken, index) => {
                const userBalance = parseFloat(poolToken.balance) * userPercentShare;

                return (
                    <Box key={`token-${index}`}>
                        <Flex mb={2} alignItems="center">
                            <Box>
                                {poolToken.symbol} - {userBalance}
                                <br />
                                {numeral(priceFor(poolToken.address) * userBalance).format('$0,0.00')}
                            </Box>
                        </Flex>
                    </Box>
                );
            })}
        </Container>
    );
}

export default PoolTokensInWallet;
