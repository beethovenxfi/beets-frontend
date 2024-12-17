import { Box, Button, Flex, Heading, HStack, Link, Text, useTheme } from '@chakra-ui/react';
import { ExternalLink } from 'react-feather';

import Image from 'next/image';
import { NextLink } from '~/components/link/NextLink';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import FBeetsIcon from '~/assets/logo/token-fBEETS.png';
import { FBeetsTokenSonic } from '~/assets/logo/FBeetsTokenSonic';

export default function ReliquaryHeroBanner() {
    const theme = useTheme();
    const { chainId } = useNetworkConfig();

    return (
        <Flex
            height="200px"
            overflow="hidden"
            minHeight="200px"
            backgroundImage="url('/images/ma-beets-banner.png')"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
            boxShadow="0px 0px 0px 1px #00000005,1px 1px 1px -0.5px #0000000F,3px 3px 3px -1.5px #0000000F,6px 6px 6px -3px #0000000F,12px 12px 12px -6px #0000000F,24px 24px 24px -12px #0000001A,-0.5px -1px 0px 0px #FFFFFF26"
            borderRadius="10px"
        >
            <Flex flex="1" pl={{ base: '4', xl: '8' }} alignItems="center">
                <Flex flexDirection="column" justifyContent="center" alignItems="center">
                    <Heading size="lg" mb="2">
                        maBEETS
                    </Heading>
                    <Text color="white" fontSize="md" textAlign="center">
                        Maturity adjusted voting power,
                        <br />
                        voting incentives and $BEETS rewards
                    </Text>
                </Flex>
            </Flex>
            <Flex flex="1" flexDirection="column" justifyContent="center" ml="12">
                <Flex alignItems="center">
                    <Box>
                        <ul>
                            <li>Participate in BEETS governance</li>
                            <li>Unlock maturity adjusted rewards</li>
                            <li>Access evolving Ludwig fNFTs</li>
                        </ul>
                        <Link href="https://docs.beets.fi/beets/mabeets" target="_blank" mt="2">
                            <Flex alignItems="center">
                                <Box>Learn more</Box>
                                <Box ml="1">
                                    <ExternalLink size={16} />
                                </Box>
                            </Flex>
                        </Link>
                    </Box>
                    <Box ml="8">
                        <FBeetsTokenSonic height="110px" width="110px" />
                    </Box>
                </Flex>
            </Flex>
        </Flex>
    );
}
