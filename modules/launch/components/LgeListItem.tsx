import { Box, Grid, GridItem, Link as ChakraLink, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { BoxProps } from '@chakra-ui/layout';
import { useGetLgeToken } from './lib/useGetLgeToken';
import TokenAvatar from '~/components/token/TokenAvatar';
import { formatDistanceToNow } from 'date-fns';
import { GqlLgeExtended } from '~/modules/launch/useLgeList';
import DiscordIcon from '~/assets/icons/discord.svg';
import TwitterIcon from '~/assets/icons/twitter.svg';
import MediumIcon from '~/assets/icons/medium.svg';
import TelegramIcon from '~/assets/icons/telegram.svg';
import GlobeIcon from '~/assets/icons/globe.svg';
import NextImage from 'next/image';

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
            <Link href={`/launch/${lge.id}`} passHref>
                <a>
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
                                    <ChakraLink
                                        href={lge.websiteUrl}
                                        target="_blank"
                                        color="gray.100"
                                        _hover={{ color: 'beets.highlight' }}
                                    >
                                        <NextImage src={GlobeIcon} />
                                    </ChakraLink>
                                </Box>
                            )}
                            {lge.twitterUrl && (
                                <Box mr="3">
                                    <ChakraLink
                                        href={lge.twitterUrl}
                                        target="_blank"
                                        color="gray.100"
                                        _hover={{ color: 'beets.highlight' }}
                                    >
                                        <NextImage src={TwitterIcon} />
                                    </ChakraLink>
                                </Box>
                            )}
                            {lge.discordUrl && (
                                <Box mr="3">
                                    <ChakraLink
                                        href={lge.twitterUrl}
                                        target="_blank"
                                        color="gray.100"
                                        _hover={{ color: 'beets.highlight' }}
                                    >
                                        <NextImage src={DiscordIcon} />
                                    </ChakraLink>
                                </Box>
                            )}
                            {lge.telegramUrl && (
                                <Box mr="3">
                                    <ChakraLink
                                        href={lge.telegramUrl}
                                        target="_blank"
                                        color="gray.100"
                                        _hover={{ color: 'beets.highlight' }}
                                    >
                                        <NextImage src={TelegramIcon} />
                                    </ChakraLink>
                                </Box>
                            )}
                            {lge.mediumUrl && (
                                <Box mr="3">
                                    <ChakraLink
                                        href={lge.mediumUrl}
                                        target="_blank"
                                        color="gray.100"
                                        _hover={{ color: 'beets.highlight' }}
                                    >
                                        <NextImage src={MediumIcon} />
                                    </ChakraLink>
                                </Box>
                            )}
                        </GridItem>
                    </Grid>
                </a>
            </Link>
        </Box>
    );
}
