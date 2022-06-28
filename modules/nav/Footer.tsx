import { Box, Flex, HStack, Link, useTheme } from '@chakra-ui/react';
import NextImage from 'next/image';
import BeetsLogo from '~/assets/logo/beets-logo.svg';
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
                    <Flex>
                        <Box flex="1">
                            <FooterLink>Invest</FooterLink>
                            <FooterLink>Swap</FooterLink>
                            <FooterLink>Stake</FooterLink>
                            <FooterLink>Launch</FooterLink>
                        </Box>
                        <Box flex="1">
                            <FooterLink>Vote</FooterLink>
                            <FooterLink>Analytics</FooterLink>
                            <FooterLink>Docs & Help</FooterLink>
                        </Box>
                        <Box flex="1">
                            <FooterLink>Olympus Bonds</FooterLink>
                            <FooterLink>Multichain Bridge</FooterLink>
                            <FooterLink>AllBridge</FooterLink>
                        </Box>
                    </Flex>
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
                <Box flex="1" justifyContent="flex-end" display="flex">
                    <NextImage src={DegenBand} width="590px" height="493.5px" />
                </Box>
            </Flex>
        </Box>
    );
}
