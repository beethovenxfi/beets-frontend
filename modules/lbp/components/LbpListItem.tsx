import { BoxProps } from '@chakra-ui/layout';
import { GqlLbp } from '~/apollo/generated/graphql-codegen-generated';
import { Avatar, Box, Button, Circle, Grid, GridItem, GridItemProps, HStack, Link, Text } from '@chakra-ui/react';
import numeral from 'numeral';
import { memo } from 'react';
import { TokenAvatarSetInList, TokenAvatarSetInListTokenData } from '~/components/token/TokenAvatarSetInList';
import { networkConfig } from '~/lib/config/network-config';
import { oldBnumScale } from '~/lib/services/pool/lib/old-big-number';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import TokenAvatar from '~/components/token/TokenAvatar';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { AddressZero } from '@ethersproject/constants';
import { formatDistanceToNow, isAfter, isBefore, parseISO } from 'date-fns';
import NextImage from 'next/image';
import DiscordIcon from '~/assets/icons/discord.svg';
import TwitterIcon from '~/assets/icons/twitter.svg';
import GithubIcon from '~/assets/icons/github.svg';
import MediumIcon from '~/assets/icons/medium.svg';

interface Props extends BoxProps {
    lbp: GqlLbp;
}

export function LbpListItem({ lbp, ...rest }: Props) {
    const status: 'active' | 'upcoming' | 'ended' = isBefore(new Date(), parseISO(lbp.startDate))
        ? 'upcoming'
        : isAfter(new Date(), parseISO(lbp.endDate))
        ? 'ended'
        : 'active';

    return (
        <Box {...rest}>
            <Grid px="4" py="4" gap="0" templateColumns="250px 1fr 300px 150px">
                <GridItem>
                    <HStack>
                        <Avatar
                            src={lbp.tokenIconUrl}
                            size="xs"
                            bg={'transparent'}
                            icon={
                                <Jazzicon
                                    seed={jsNumberForAddress(lbp.tokenContractAddress || AddressZero)}
                                    paperStyles={{ width: '100%', height: '100%' }}
                                />
                            }
                        />
                        <Text fontSize="md" fontWeight="normal">
                            {lbp.token.symbol}
                        </Text>
                    </HStack>
                </GridItem>
                <GridItem>{lbp.name}</GridItem>

                <GridItem>
                    <HStack alignItems="center">
                        <Circle
                            size="14px"
                            backgroundColor={
                                status === 'active' ? 'beets.green' : status === 'upcoming' ? 'orange' : 'red'
                            }
                        />
                        <Text>
                            {isBefore(new Date(), parseISO(lbp.startDate))
                                ? `Starts in ${formatDistanceToNow(parseISO(lbp.startDate))}`
                                : isAfter(new Date(), parseISO(lbp.endDate))
                                ? `Ended ${formatDistanceToNow(parseISO(lbp.endDate))} ago`
                                : `Ends in ${formatDistanceToNow(parseISO(lbp.endDate))}`}
                        </Text>
                    </HStack>
                </GridItem>

                <GridItem>
                    <HStack>
                        <Box>
                            <Link href="https://discord.gg/jedS4zGk28" target="_blank" _active={{ boxShadow: 'none' }}>
                                <NextImage src={DiscordIcon} style={{ width: '14px', height: '14px' }} />
                            </Link>
                        </Box>
                        <Box>
                            <Link
                                href="https://twitter.com/beethoven_x"
                                target="_blank"
                                _active={{ boxShadow: 'none' }}
                            >
                                <NextImage src={TwitterIcon} />
                            </Link>
                        </Box>
                        <Box>
                            <Link
                                href="https://github.com/beethovenxfi"
                                target="_blank"
                                _active={{ boxShadow: 'none' }}
                            >
                                <NextImage src={GithubIcon} />
                            </Link>
                        </Box>
                        <Box>
                            <Link
                                href="https://beethovenxio.medium.com/"
                                target="_blank"
                                _active={{ boxShadow: 'none' }}
                            >
                                <NextImage src={MediumIcon} />
                            </Link>
                        </Box>
                    </HStack>
                </GridItem>
            </Grid>
        </Box>
    );
}
