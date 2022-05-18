import { GqlPoolBase, GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import TokenAvatar from '~/components/token-avatar/TokenAvatar';
import { poolTokensWithoutPhantomBpt } from '~/lib/services/pool/pool-util';
import numeral from 'numeral';

interface Props {
    pool: GqlPoolUnion;
}

function PoolHeader({ pool }: Props) {
    const poolTokens = poolTokensWithoutPhantomBpt(pool);

    return (
        <>
            <Heading>{pool.name}</Heading>
            <Flex mt={4}>
                {poolTokens.map((token, index) => (
                    <Flex key={index} alignItems="center" mr={2} bg="gray.900" shadow="lg" rounded="lg" padding="2">
                        <TokenAvatar address={token.address} size={'sm'} />
                        <Text ml={2}>{token.symbol}</Text>
                        {token.weight ? <Text ml={2}>{numeral(token.weight).format('%')}</Text> : null}
                    </Flex>
                ))}
            </Flex>
            <Box mt={2}>Swap fee: {numeral(pool.dynamicData.swapFee).format('0.0[00]%')}</Box>
        </>
    );
}

export default PoolHeader;
