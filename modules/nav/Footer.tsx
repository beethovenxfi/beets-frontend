import { Box, Flex, Grid, GridItem, HStack, Link } from '@chakra-ui/react';
import NextImage from 'next/image';
import DegenBand from '~/assets/images/degen-band.png';
import FooterImageOp from '~/assets/images/footer-OP.png';
import DiscordIcon from '~/assets/icons/discord.svg';
import TwitterIcon from '~/assets/icons/twitter.svg';
import MediumIcon from '~/assets/icons/medium.svg';
import GithubIcon from '~/assets/icons/github.svg';
import { FooterLink } from '~/modules/nav/FooterLink';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { networkConfig } from '~/lib/config/network-config';
import { BeetsBalLogo } from '~/assets/logo/BeetsBalLogo';
import { BeetsLogo } from '~/assets/logo/BeetsLogo';

export function Footer() {
    const { chainId } = useNetworkConfig();

    return (
        <Box width="full" px={{ base: '4', xl: '8' }} bgColor="beets.base.800" pt="24">
            <Flex>
                <Box flex="1">
                    <Box mb="12">{chainId === '10' ? <BeetsBalLogo /> : <BeetsLogo />}</Box>
                    <Grid templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="8">
                        <GridItem>
                            <FooterLink href="/pools" linkType="internal">
                                Invest
                            </FooterLink>
                            <FooterLink href="/swap" linkType="internal">
                                Swap
                            </FooterLink>
                            {networkConfig.stakeUrl && <FooterLink href={networkConfig.stakeUrl}>Stake</FooterLink>}
                            {networkConfig.launchUrl && <FooterLink href={networkConfig.launchUrl}>Launch</FooterLink>}
                        </GridItem>
                        <GridItem>
                            {networkConfig.additionalLinks.slice(0, 3).map((link, index) => (
                                <FooterLink key={index} href={link.url}>
                                    {link.title}
                                </FooterLink>
                            ))}
                            <FooterLink href={networkConfig.createPoolUrl}>Compose a pool</FooterLink>
                        </GridItem>
                        <GridItem>
                            {networkConfig.additionalLinks.slice(7, 10).map((link, index) => (
                                <FooterLink key={index} href={link.url}>
                                    {link.title}
                                </FooterLink>
                            ))}
                        </GridItem>
                    </Grid>

                    <HStack spacing="6" mt="24">
                        {networkConfig.additionalLinks.slice(3, 7).map((link, index) => {
                            function renderIcon() {
                                switch (link.title) {
                                    case 'Discord':
                                        return <NextImage src={DiscordIcon} />;
                                    case 'Twitter':
                                        return <NextImage src={TwitterIcon} />;
                                    case 'Github':
                                        return <NextImage src={GithubIcon} />;
                                    case 'Medium':
                                        return <NextImage src={MediumIcon} />;
                                }
                            }

                            return (
                                <Box key={index}>
                                    <Link href={link.url} target="_blank" _active={{ boxShadow: 'none' }}>
                                        {renderIcon()}
                                    </Link>
                                </Box>
                            );
                        })}
                    </HStack>
                </Box>
                <Box flex="1" justifyContent="flex-end" display={{ base: 'none', lg: 'flex' }} ml="12">
                    <NextImage src={chainId === '10' ? FooterImageOp : DegenBand} width="472px" height="394.8px" />
                </Box>
            </Flex>
        </Box>
    );
}
