import { Box, Flex, Grid, GridItem, HStack, Link, useTheme } from '@chakra-ui/react';
import NextImage from 'next/image';
//import BeetsLogo from '~/assets/logo/beets-logo.svg';
import BeetsLogo from '~/assets/logo/beets-bal.svg';
import DegenBand from '~/assets/images/degen-band.png';
import DiscordIcon from '~/assets/icons/discord.svg';
import TwitterIcon from '~/assets/icons/twitter.svg';
import MediumIcon from '~/assets/icons/medium.svg';
import GithubIcon from '~/assets/icons/github.svg';
import { FooterLink } from '~/modules/nav/FooterLink';

export function Footer() {
    const theme = useTheme();

    return (
        <Box
            width={{ base: 'full', '2xl': theme.breakpoints['2xl'] }}
            pl={{ base: '4', xl: '8' }}
            bgColor="beets.base.800"
            pt="24"
        >
            <Flex>
                <Box flex="1">
                    <Box mb="12">
                        <NextImage src={BeetsLogo} />
                    </Box>
                    <Grid templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="8">
                        <GridItem>
                            <FooterLink>Invest</FooterLink>
                            <FooterLink>Swap</FooterLink>
                            <FooterLink>Stake</FooterLink>
                            <FooterLink>Launch</FooterLink>
                        </GridItem>
                        <GridItem>
                            <FooterLink>Vote</FooterLink>
                            <FooterLink>Analytics</FooterLink>
                            <FooterLink>Docs & Help</FooterLink>
                        </GridItem>
                        <GridItem>
                            <FooterLink>Olympus Bonds</FooterLink>
                            <FooterLink>Multichain Bridge</FooterLink>
                            <FooterLink>AllBridge</FooterLink>
                        </GridItem>
                    </Grid>

                    <HStack spacing="6" mt="24">
                        <Box>
                            <NextImage src={DiscordIcon} />
                        </Box>
                        <Box>
                            <NextImage src={TwitterIcon} />
                        </Box>
                        <Box>
                            <NextImage src={GithubIcon} />
                        </Box>
                        <Box>
                            <NextImage src={MediumIcon} />
                        </Box>
                    </HStack>
                </Box>
                <Box flex="1" justifyContent="flex-end" display={{ base: 'none', lg: 'flex' }} ml="12">
                    <NextImage src={DegenBand} width="590px" height="493.5px" />
                </Box>
            </Flex>
        </Box>
    );
}
