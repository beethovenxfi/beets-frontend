import { Box, Grid, GridItem, Link, Text } from '@chakra-ui/react';
import { BoxProps } from '@chakra-ui/layout';
import { useGetLgeToken } from './lib/useGetLgeToken';
import TokenAvatar from '~/components/token/TokenAvatar';
import { formatDistanceToNow } from 'date-fns';
import { GqlLgeExtended } from '~/modules/launch/useLgeList';
import { Globe } from 'react-feather';
import { IconTwitter } from '~/components/icons/IconTwitter';
import { IconDiscord } from '~/components/icons/IconDiscord';
import { IconTelegram } from '~/components/icons/IconTelegram';
import { IconMedium } from '~/components/icons/IconMedium';

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

export function LgeListItem({ lge, ...rest }: Props) {
    const { token } = useGetLgeToken(lge.tokenContractAddress);

    return (
        <Box mb={{ base: '4', lg: '0' }} borderRadius={{ base: 'md', lg: '0' }} {...rest}>
            <Grid
                pl="4"
                py={{ base: '4', lg: '0' }}
                height={{ lg: '63.5px' }}
                templateColumns={{
                    //base: '1fr 1fr',
                    lg: 'repeat(4, 1fr)',
                }}
                gap="0"
                templateAreas={{
                    //   base: `"name boosted"
                    //          "apr tvl"
                    //          "fees volume"
                    //          "icons icons"`,
                    lg: `"project token status links"`,
                }}
                cursor="pointer"
            >
                <GridItem area="project" mb={{ base: '4', lg: '0' }} alignItems="center" display="flex">
                    <Text fontSize={{ base: 'xl', lg: 'md' }} fontWeight={{ base: 'bold', lg: 'normal' }}>
                        {lge.name}
                    </Text>
                    {/* {warningMessage && <LgeListItemWarning ml="2" message={warningMessage} />} */}
                </GridItem>
                <GridItem area="token" alignItems="center" display="flex" mb={{ base: '4', lg: '0' }}>
                    <TokenAvatar address={lge.tokenContractAddress} logoURI={lge.tokenIconUrl} size="xs" />
                    <Text ml="2">{token?.symbol}</Text>
                </GridItem>
                <GridItem area="status" alignItems="center" display="flex" mb={{ base: '4', lg: '0' }}>
                    {getStatusText(lge)}
                </GridItem>
                <GridItem area="links" alignItems="center" display="flex" mb={{ base: '4', lg: '0' }}>
                    {lge.websiteUrl && (
                        <Box mr="3">
                            <Link
                                href={lge.websiteUrl}
                                target="_blank"
                                color="gray.100"
                                _hover={{ color: 'beets.highlight' }}
                            >
                                <Globe size={28} />
                            </Link>
                        </Box>
                    )}
                    {lge.twitterUrl && (
                        <Box mr="3">
                            <Link href={lge.twitterUrl} target="_blank" color="gray.100">
                                <IconTwitter color="#c1c1d1" _hover={{ color: 'beets.highlight' }} />
                            </Link>
                        </Box>
                    )}
                    {lge.discordUrl && (
                        <Box mr="3">
                            <Link
                                href={lge.twitterUrl}
                                target="_blank"
                                color="gray.100"
                                _hover={{ color: 'beets.highlight' }}
                            >
                                <IconDiscord color="#c1c1d1" _hover={{ color: 'beets.highlight' }} />
                            </Link>
                        </Box>
                    )}
                    {lge.telegramUrl && (
                        <Box mr="3">
                            <Link
                                href={lge.telegramUrl}
                                target="_blank"
                                color="gray.100"
                                _hover={{ color: 'beets.highlight' }}
                            >
                                <IconTelegram color="#c1c1d1" _hover={{ color: 'beets.highlight' }} />
                            </Link>
                        </Box>
                    )}
                    {lge.mediumUrl && (
                        <Box mr="3">
                            <Link
                                href={lge.mediumUrl}
                                target="_blank"
                                color="gray.100"
                                _hover={{ color: 'beets.highlight' }}
                            >
                                <IconMedium color="#c1c1d1" _hover={{ color: 'beets.highlight' }} />
                            </Link>
                        </Box>
                    )}
                </GridItem>
            </Grid>
        </Box>
    );
}
