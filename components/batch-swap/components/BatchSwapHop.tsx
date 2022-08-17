import { Box } from '@chakra-ui/react';
import TokenAvatarSet from '~/components/token/TokenAvatarSet';
import { NextLink } from '~/components/link/NextLink';

interface Props {
    hop: {
        tokenIn: string;
        tokenOut: string;
        pool: {
            id: string;
            allTokens: {
                address: string;
                weight?: string | null;
                isNested?: boolean;
                isPhantomBpt?: boolean;
            }[];
        };
    };
}

export function BatchSwapHop({ hop }: Props) {
    const tokens = hop.pool.allTokens
        .filter((token) => !token.isNested && !token.isPhantomBpt)
        .map((token) => ({ address: token.address, weight: token.weight }));
    const tokenIn = tokens.find((token) => token.address === hop.tokenIn);
    const tokenOut = tokens.find((token) => token.address === hop.tokenOut);

    return (
        <Box
            height="28px"
            display="flex"
            alignItems="center"
            borderRadius="lg"
            px="2"
            py="1"
            backgroundColor="beets.base.600"
        >
            <NextLink href={`/pool/${hop.pool.id}`} chakraProps={{ color: 'white' }}>
                <TokenAvatarSet
                    imageSize={20}
                    width={80}
                    tokenData={[
                        ...(tokenIn ? [tokenIn] : []),
                        ...tokens.filter((token) => token.address !== hop.tokenIn && token.address !== hop.tokenOut),
                        ...(tokenOut ? [tokenOut] : []),
                    ]}
                />
            </NextLink>
        </Box>
    );
}
