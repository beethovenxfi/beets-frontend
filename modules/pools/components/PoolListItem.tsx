import { GqlPoolBaseFragment } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Flex, Heading } from '@chakra-ui/react';
import TokenAvatarSet from '~/components/token-avatar/TokenAvatarSet';
import Link from 'next/link';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';

interface Props {
    pool: GqlPoolBaseFragment;
}

export default function PoolListItem({ pool }: Props) {
    return (
        <Link href={`/pool/${pool.id}`}>
            <Flex bg={'black'} mb={2} p={4} cursor="pointer" borderRadius={4} alignItems={'center'}>
                <Box flex={1}>
                    <Heading mb={2} size={'md'}>
                        {pool.name}
                    </Heading>
                    <TokenAvatarSet
                        my={4}
                        imageSize={38}
                        addresses={pool.allTokens
                            .filter((token) => !token.isNested && !token.isPhantomBpt)
                            .map((token) => token.address)}
                    />
                </Box>
                <Box w={200} textAlign={'center'}>
                    {numeral(pool.dynamicData.totalLiquidity).format('$0,0')}
                </Box>
                <Box w={200} textAlign={'center'}>
                    {numeral(pool.dynamicData.volume24h).format('$0,0')}
                </Box>
                <Box w={100}>
                    <AprTooltip data={pool.dynamicData.apr} />
                </Box>
            </Flex>
        </Link>
    );
}
