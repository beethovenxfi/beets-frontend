import { Box, Flex, HStack, Image, Text } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { PoolCard } from '~/components/pool-card/PoolCard';
import NextImage from 'next/image';
import PoolIcon1 from '~/assets/icons/pool-icon-1.svg';
import PoolIcon2 from '~/assets/icons/pool-icon-2.svg';
import PoolIcon3 from '~/assets/icons/pool-icon-3.svg';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import TokenAvatarSet from '~/components/token/TokenAvatarSet';
import { PoolCardSmall } from '~/components/pool-card/PoolCardSmall';

export function HomePoolCategories() {
    return (
        <Box py="12">
            <Flex>
                <BeetsBox flex={1.25} mr="4" p="4" bgColor="beets.base.800" display="flex" flexDirection="column">
                    <Box fontSize="xl" mb="4" fontWeight="bold">
                        Index fund pools
                    </Box>
                    <Flex mb="4" flex="1">
                        <PoolCardSmall mr="4" bgColor="beets.base.600" />
                        <PoolCardSmall bgColor="beets.base.600" />
                    </Flex>
                    <Flex flex="1">
                        <PoolCardSmall mr="4" bgColor="beets.base.600" />
                        <PoolCardSmall bgColor="beets.base.600" />
                    </Flex>
                </BeetsBox>
                <Flex flexDirection="column" flex={1}>
                    <BeetsBox flex={1} p="4" mb="4" bgColor="beets.base.800">
                        <Box fontSize="xl" mb="4" fontWeight="bold">
                            Boosted pools
                        </Box>
                        <Flex>
                            <PoolCardSmall mr="4" bgColor="beets.base.600" tokenSize={32} />
                            <PoolCardSmall mr="4" bgColor="beets.base.600" tokenSize={32} />
                            <PoolCardSmall bgColor="beets.base.600" tokenSize={32} />
                        </Flex>
                    </BeetsBox>
                    <BeetsBox flex={1} p="4" bgColor="beets.base.800">
                        <Box fontSize="xl" mb="4" fontWeight="bold">
                            Stable pools
                        </Box>
                        <Flex>
                            <PoolCardSmall mr="4" bgColor="beets.base.600" tokenSize={32} />
                            {/*<PoolCardSmall mr="4" bgColor="beets.base.600" tokenSize={32} />*/}
                            <PoolCardSmall bgColor="beets.base.600" tokenSize={32} />
                        </Flex>
                    </BeetsBox>
                </Flex>
            </Flex>
        </Box>
    );
}
