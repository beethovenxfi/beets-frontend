import { Box, BoxProps, Flex, HStack, Image, Text } from '@chakra-ui/react';
import PoolIcon1 from '~/assets/icons/pool-icon-1.svg';
import PoolIcon2 from '~/assets/icons/pool-icon-2.svg';
import PoolIcon3 from '~/assets/icons/pool-icon-3.svg';
import NextImage from 'next/image';
import { PoolCard } from '~/components/pool-card/PoolCard';
import { BeetsHeadline } from '~/components/typography/BeetsHeadline';
import BeetsButton from '~/components/button/Button';
import { BeetsSubHeadline } from '~/components/typography/BeetsSubHeadline';

export function HomePools(props: BoxProps) {
    return (
        <Box {...props}>
            <BeetsHeadline mb="10">My investments</BeetsHeadline>
            <Box mb="16">
                <BeetsSubHeadline mb="4">$361.85 invested across 4 pools</BeetsSubHeadline>
                <Flex>
                    <PoolCard mr="6" flex="1" />
                    <PoolCard mr="6" flex="1" />
                    <PoolCard flex="1" />
                </Flex>
            </Box>
            <BeetsHeadline mb="10">Featured pools</BeetsHeadline>
            <Box mb="8">
                <Flex mb="4">
                    <NextImage src={PoolIcon1} />
                    <BeetsSubHeadline ml="2">New & popular</BeetsSubHeadline>
                </Flex>
                <Flex>
                    <PoolCard mr="6" flex="1" />
                    <PoolCard mr="6" flex="1" />
                    <PoolCard flex="1" />
                </Flex>
            </Box>
            <Box mb="8">
                <Flex mb="4">
                    <NextImage src={PoolIcon2} />
                    <BeetsSubHeadline ml="2">Index fund pools</BeetsSubHeadline>
                </Flex>
                <Flex>
                    <PoolCard mr="6" flex="1" />
                    <PoolCard mr="6" flex="1" />
                    <PoolCard flex="1" />
                </Flex>
            </Box>
            <Box mb="8">
                <Flex mb="4">
                    <NextImage src={PoolIcon3} />
                    <BeetsSubHeadline ml="2">Boosted pools</BeetsSubHeadline>
                </Flex>
                <Flex>
                    <PoolCard mr="6" flex="1" />
                    <PoolCard mr="6" flex="1" />
                    <Flex flex="1" position="relative" alignItems="flex-end" justifyContent="center">
                        <Image
                            src="https://beethoven-assets.s3.eu-central-1.amazonaws.com/boosted-ludwig-min.png"
                            width="full"
                            position="absolute"
                            top="0"
                            left="0"
                            bottom="0"
                            right="0"
                        />
                        <BeetsButton onClick={() => {}}>What is a Boosted pool?</BeetsButton>
                    </Flex>
                </Flex>
            </Box>
            <Box>
                <Flex mb="4">
                    <NextImage src={PoolIcon3} />
                    <BeetsSubHeadline ml="2">Stable pools</BeetsSubHeadline>
                </Flex>
                <Flex>
                    <PoolCard mr="6" flex="1" />
                    <PoolCard mr="6" flex="1" />
                    <Box flex="1" />
                </Flex>
            </Box>
        </Box>
    );
}
