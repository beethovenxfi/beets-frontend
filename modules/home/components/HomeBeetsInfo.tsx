import { Box, BoxProps, Flex, Text } from '@chakra-ui/react';
import { BeetsHeadline } from '~/components/typography/BeetsHeadline';
import NextImage from 'next/image';
import BeetsTokenInfoImage from '~/assets/images/beets-token-info.png';
import BeetsButton from '~/components/button/Button';

export function HomeBeetsInfo(props: BoxProps) {
    return (
        <Box {...props}>
            <BeetsHeadline mb="8">The BEETS token</BeetsHeadline>
            <Box display="flex" justifyContent="center" mb="8" alignItems="center">
                <NextImage src={BeetsTokenInfoImage} width="466px" height="253px" />
            </Box>
            <Box mb="10">
                The BEETS token launched in October 2021, providing our community with rewards value, incentives and
                also utility with governance & gauge voting rights with the extended fBEETS token.
            </Box>
            <BeetsButton as="a" href="https://docs.beets.fi/beets/tokenomics" target="_blank">
                BEETS tokenomics
            </BeetsButton>
        </Box>
    );
}
