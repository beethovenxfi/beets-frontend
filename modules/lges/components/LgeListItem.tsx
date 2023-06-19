import { Box, Grid, GridItem, HStack, Link, Text } from '@chakra-ui/react';
import { BoxProps } from '@chakra-ui/layout';
import { useGetLgeToken } from './lib/useGetLgeToken';
import TokenAvatar from '~/components/token/TokenAvatar';
import { formatDistanceToNow } from 'date-fns';
import { GqlLgeExtended } from '~/modules/lges/lib/useLgeList';
import { IconTwitter } from '~/components/icons/IconTwitter';
import { IconDiscord } from '~/components/icons/IconDiscord';
import { IconTelegram } from '~/components/icons/IconTelegram';
import { IconMedium } from '~/components/icons/IconMedium';
import { IconGlobe } from '~/components/icons/IconGlobe';
import React, { ReactNode } from 'react';

interface Props extends BoxProps {
    lge: GqlLgeExtended;
}

function getStatusText(lge: GqlLgeExtended) {
    switch (lge.status) {
        case 'active':
            return `Ends in ${formatDistanceToNow(new Date(lge.endDate))}`;
        case 'upcoming':
            return `Starts in ${formatDistanceToNow(new Date(lge.startDate))}`;
        case 'ended':
            return `Ended ${formatDistanceToNow(new Date(lge.endDate))} ago`;
    }
}

function getIconLink(urlType: keyof typeof lge, lge: GqlLgeExtended): ReactNode {
    const href = lge[urlType] as string;

    if (!href) {
        return null;
    }

    const props = {
        color: '#c1c1d1',
    };

    const hoverProps = { color: 'beets.highlight' };

    let iconType;
    switch (urlType) {
        case 'discordUrl':
            iconType = <IconDiscord {...props} _hover={hoverProps} />;
            break;
        case 'mediumUrl':
            iconType = <IconMedium {...props} _hover={hoverProps} />;
            break;
        case 'telegramUrl':
            iconType = <IconTelegram {...props} _hover={hoverProps} />;
            break;
        case 'twitterUrl':
            iconType = <IconTwitter {...props} _hover={hoverProps} />;
            break;
        case 'websiteUrl':
            iconType = <IconGlobe {...props} _hover={hoverProps} />;
            break;
    }
    return (
        <Link href={href} target="_blank" color="gray.100">
            {iconType}
        </Link>
    );
}

export function LgeListItem({ lge, ...rest }: Props) {
    const { token } = useGetLgeToken(lge.tokenContractAddress);

    // grab all urlTypes except for banner image & token icon
    // reverse for now to to get the website url first
    const urlTypes = Object.keys(lge)
        .filter((key) => key.match('Url') && !key.match('Image') && !key.match('Icon'))
        .reverse();

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
                        <TokenAvatar address={lge.tokenContractAddress} logoURI={lge.tokenIconUrl} size="xs" />
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
                    <HStack mt="2">{urlTypes.map((urlType) => getIconLink(urlType as keyof typeof lge, lge))}</HStack>
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
