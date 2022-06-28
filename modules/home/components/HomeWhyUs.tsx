import { Box, BoxProps, Flex, Text } from '@chakra-ui/react';
import NextImage from 'next/image';
import WhyUsImage from '~/assets/images/why-us.png';
import { BeetsHeadline } from '~/components/typography/BeetsHeadline';

export function HomeWhyUs(props: BoxProps) {
    return (
        <Box {...props}>
            <BeetsHeadline mb="8">Beethoven X is for everyone</BeetsHeadline>
            <Box mr="20">
                With a commitment to the principles of DeFi and blockchain decentralization, the Beethoven X project
                provides the platform, tech and tools for anyone to participate, create and learn in a supportive
                environment.
            </Box>
            <Box my="6" display="flex" justifyContent="center">
                <NextImage src={WhyUsImage} width="657px" height="250px" />
            </Box>
            <Flex>
                <Box flex="1" mr="12">
                    <Text fontSize="2xl" fontWeight="bold" color="white" mb="6">
                        For Traders
                    </Text>
                    <Box>
                        Balancer V2 enables efficient trading by pooling crowdsourced liquidity from investor portfolios
                        and using its unique Smart Order Router to find traders the best available price.
                    </Box>
                </Box>
                <Box flex="1" mr="12">
                    <Text fontSize="2xl" fontWeight="bold" color="white" mb="6">
                        For Investors
                    </Text>
                    <Box>
                        Create a unique crypto index fund tailored to your desired asset allocations. Collect fees from
                        traders who rebalance your funds by following arbitrage opportunities.
                    </Box>
                </Box>
                <Box flex="1">
                    <Text fontSize="2xl" fontWeight="bold" color="white" mb="6">
                        For Protocols
                    </Text>
                    <Box>
                        Launch your token in the fairest way possible, using an LGE. Use an 80/20 BPT instead of single
                        staking to capture market volatility with minimal impermanent loss.
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
}
