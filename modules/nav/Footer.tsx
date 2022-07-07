import { Box, Flex, Grid, GridItem, HStack, Link } from '@chakra-ui/react';
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
    return (
        <Box width="full" px={{ base: '4', xl: '8' }} bgColor="beets.base.800" pt="24">
            <Flex>
                <Box flex="1">
                    <Box mb="12">
                        <NextImage src={BeetsLogo} />
                    </Box>
                    <Grid templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap="8">
                        <GridItem>
                            <FooterLink href="/pools" linkType="internal">
                                Invest
                            </FooterLink>
                            <FooterLink href="/trade" linkType="internal">
                                Swap
                            </FooterLink>
                            <FooterLink href="/trade" linkType="internal">
                                Stake
                            </FooterLink>
                            <FooterLink href="/trade" linkType="internal">
                                Launch
                            </FooterLink>
                        </GridItem>
                        <GridItem>
                            <FooterLink href="https://snapshot.org/#/beets.eth">Vote</FooterLink>
                            <FooterLink href="https:/info.beets.fi">Analytics</FooterLink>
                            <FooterLink href="https:/docs.beets.fi">Docs & Help</FooterLink>
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
                    <NextImage src={DegenBand} width="472px" height="394.8px" />
                </Box>
            </Flex>
        </Box>
    );
}
