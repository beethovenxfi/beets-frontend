import { Box, Flex, Link, Spacer } from '@chakra-ui/react';

import { ExternalLink } from 'react-feather';
import { GqlPoolTokenBase } from '~/apollo/generated/graphql-codegen-generated';
import TokenAvatar from '~/components/token/TokenAvatar';
import { etherscanGetTokenUrl } from '~/lib/util/etherscan';
import numeral from 'numeral';
import { useGetTokens } from '~/lib/global/useToken';

interface Props {
    token: GqlPoolTokenBase;
    last?: boolean;
    nestLevel?: number;
}

function PoolCompositionToken({ token, last, nestLevel = 0 }: Props) {
    const { priceFor } = useGetTokens();
    const balance = parseFloat(token.balance);
    const value = balance * priceFor(token.address);

    // bgColor={'beets.gray.300'}
    return (
        <Flex pb={last ? 0 : 2} w="100%">
            <Box w={125}>
                <Link href={etherscanGetTokenUrl(token.address)} isExternal={true} display={'flex'} alignItems="center">
                    <TokenAvatar address={token.address} size={'sm'} />
                    <Box ml={2} mr={2}>
                        {token.symbol}
                    </Box>
                    <ExternalLink size={14} />
                </Link>
            </Box>
            {/* {token.weight ? <Box mr={4}>{numeral(token.weight).format('%')}</Box> : <Spacer />} */}
            <Box w={125} textAlign="end" mr={4} color={nestLevel > 0 ? 'beets.gray.200' : undefined}>
                {numeral(balance).format(balance < 1000 ? '0.[0000]' : '0,0')}
            </Box>
            <Box w={125} textAlign="end" color={nestLevel > 0 ? 'beets.gray.200' : undefined}>
                {numeral(value).format(value > 100_000 ? '$0,0' : '$0,0.[00]')}
            </Box>
        </Flex>
    );
}

export default PoolCompositionToken;
