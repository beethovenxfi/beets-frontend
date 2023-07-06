import { Box, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
import { BoxProps } from '@chakra-ui/layout';
import { useGetLgeToken } from './lib/useGetLgeToken';
import TokenAvatar from '~/components/token/TokenAvatar';
import { formatDistanceToNow } from 'date-fns';
import { GqlLgeExtended } from '~/modules/lges/lib/useLgeList';
import React from 'react';
import { LgeIconLinks } from './LgeIconLinks';

interface Props extends BoxProps {
    lge: GqlLgeExtended;
}

function getStatusText(lge: GqlLgeExtended) {
    switch (lge.status) {
        case 'active':
            return `Ends in ${formatDistanceToNow(new Date(lge.endTimestamp * 1000))}`;
        case 'upcoming':
            return `Starts in ${formatDistanceToNow(new Date(lge.startTimestamp * 1000))}`;
        case 'ended':
            return `Ended ${formatDistanceToNow(new Date(lge.endTimestamp * 1000))} ago`;
    }
}

export function LgeListItem({ lge, ...rest }: Props) {
    const { token } = useGetLgeToken(lge.tokenAddress);

    return (
        <Box mb={{ base: '4', lg: '0' }} borderRadius={{ base: 'md', lg: '0' }} {...rest}>
            <Grid
                pl="4"
                py={{ base: '4', lg: '0' }}
                height={{ lg: '63.5px' }}
                templateColumns={{
                    base: '1fr 1fr',
                    lg: 'repeat(4, 1fr)',
                }}
                gap="0"
                templateAreas={{
                    base: `"project status"
                             "token links"`,
                    lg: `"project token status links"`,
                }}
                cursor="pointer"
            >
                <GridItem
                    area="project"
                    mb={{ base: '4', lg: '0' }}
                    alignItems="center"
                    display={{ base: 'block', lg: 'flex' }}
                >
                    <MobileLabel text="Project" />
                    <Text fontSize={{ base: 'xl', lg: 'md' }} fontWeight={{ base: 'bold', lg: 'normal' }}>
                        {lge.name}
                    </Text>
                </GridItem>
                <GridItem
                    area="token"
                    alignItems="center"
                    display={{ base: 'block', lg: 'flex' }}
                    mb={{ base: '4', lg: '0' }}
                >
                    <MobileLabel text="Token" />
                    <HStack mt="2">
                        <TokenAvatar address={lge.tokenAddress} logoURI={lge.tokenIconUrl} size="xs" />
                        <Text ml="2">{token?.symbol}</Text>
                    </HStack>
                </GridItem>
                <GridItem
                    area="status"
                    alignItems="center"
                    display={{ base: 'block', lg: 'flex' }}
                    mb={{ base: '4', lg: '0' }}
                >
                    <MobileLabel text="Status" />
                    {getStatusText(lge)}
                </GridItem>
                <GridItem
                    area="links"
                    alignItems="center"
                    display={{ base: 'block', lg: 'flex' }}
                    mb={{ base: '4', lg: '0' }}
                >
                    <MobileLabel text="Links" />
                    <LgeIconLinks lge={lge} />
                </GridItem>
            </Grid>
        </Box>
    );
}

function MobileLabel({ text }: { text: string }) {
    return (
        <Text fontSize="xs" color="gray.200" display={{ base: 'block', lg: 'none' }}>
            {text}
        </Text>
    );
}
