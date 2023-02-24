import { Box, Flex, Grid, GridItem, HStack, Link, Text } from '@chakra-ui/react';
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
                            <FooterLink href="/mabeets" linkType="internal">
                                maBEETS
                                <Text as="span" fontSize="2xs">
                                    {' '}
                                    (FTM)
                                </Text>
                            </FooterLink>
                            <FooterLink href="https://v1.beets.fi/#/launch" linkType="internal">
                                Launch
                                <Text as="span" fontSize="2xs">
                                    {' '}
                                    (FTM)
                                </Text>
                            </FooterLink>
                        </GridItem>
                        <GridItem>
                            <FooterLink href="https://snapshot.org/#/beets.eth">Vote</FooterLink>
                            <FooterLink href="https://info.beets.fi">Analytics</FooterLink>
                            <FooterLink href="https://docs.beets.fi">Docs & Help</FooterLink>
                            <FooterLink href={networkConfig.createPoolUrl}>Compose a pool</FooterLink>
                            <FooterLink href="/terms-of-service" linkType="internal">
                                Terms of Service
                            </FooterLink>
                        </GridItem>
                        <GridItem>
                            <FooterLink href="https://pro.olympusdao.finance/#/bond">Olympus Bonds</FooterLink>
                            <FooterLink href="https://app.multichain.org/#/router">Multichain Bridge</FooterLink>
                            <FooterLink href="https://app.allbridge.io/bridge?from=SOL&to=FTM&asset=SOL">
                                AllBridge
                            </FooterLink>
                        </GridItem>
                    </Grid>
                    <HStack spacing="6" mt="24">
                        <Box>
                            <Link href="https://discord.gg/jedS4zGk28" target="_blank" _active={{ boxShadow: 'none' }}>
                                <NextImage src={DiscordIcon} />
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
                </Box>
                <Box flex="1" justifyContent="flex-end" display={{ base: 'none', lg: 'flex' }} ml="12">
                    <NextImage src={chainId === '10' ? FooterImageOp : DegenBand} width="472px" height="394.8px" />
                </Box>
            </Flex>
        </Box>
    );
}
