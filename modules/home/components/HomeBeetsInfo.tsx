import { Box, BoxProps, Button, Flex, Text } from '@chakra-ui/react';
import { BeetsHeadline } from '~/components/typography/BeetsHeadline';
import NextImage from 'next/image';
import BeetsTokenInfoImage from '~/assets/images/beets-token-info.png';
import BeetsTokenInfoOpImage from '~/assets/images/beets-token-info-OP.png';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function HomeBeetsInfo(props: BoxProps) {
    const { chainId } = useNetworkConfig();

    return (
        <Box {...props}>
            <BeetsHeadline mb="8">Governance redefined</BeetsHeadline>
            <Box display="flex" justifyContent="center" mb="8" alignItems="center">
                <NextImage
                    src={chainId === '10' ? BeetsTokenInfoOpImage : BeetsTokenInfoImage}
                    width="466px"
                    height="253px"
                />
            </Box>
            <Box mb="10">
                Bringing power back to the people: The BEETs token grants users the ability to influence the evolution
                of the protocol through decentralized governance; make sure your voice is heard and have your say in
                decisions that shape the future of Beethoven X.
            </Box>
            <Button variant="primary" as="a" href="https://docs.beets.fi/beets/tokenomics" target="_blank">
                BEETS tokenomics
            </Button>
        </Box>
    );
}
