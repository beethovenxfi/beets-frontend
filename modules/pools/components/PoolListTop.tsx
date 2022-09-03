import { Box, Circle, Flex, Grid, GridItem, IconButton } from '@chakra-ui/react';
import { PoolListTabs } from '~/modules/pools/components/PoolListTabs';
import { PoolListSearch } from '~/modules/pools/components/PoolListSearch';
import { Filter } from 'react-feather';
import { PoolListTokenMultiSelect } from '~/modules/pools/components/PoolListTokenMultiSelect';
import { PoolListFilterMultiSelect } from '~/modules/pools/components/PoolListFilterMultiSelect';
import { usePoolList } from '~/modules/pools/usePoolList';
import { FadeInOutBox } from '~/components/animation/FadeInOutBox';

export function PoolListTop() {
    const { showFilters, toggleFilterVisibility, state } = usePoolList();
    const hasFiltersSelected = (state.where?.filterIn || []).length > 0 || (state.where?.tokensIn || []).length > 0;

    return (
        <Box display={{ base: 'none', lg: 'block' }}>
            <Flex pb={4}>
                <Flex flex={1}>
                    <PoolListTabs />
                    <Box position="relative">
                        <IconButton
                            aria-label="filter-button"
                            icon={<Filter />}
                            ml={4}
                            onClick={toggleFilterVisibility}
                            color={showFilters ? 'gray.100' : 'white'}
                            bgColor={showFilters ? 'beets.base.300' : 'beets.lightAlpha.300'}
                            _hover={{ bgColor: 'beets.light' }}
                        />
                        {hasFiltersSelected ? (
                            <Circle size="3" bg="red.500" opacity="0.85" position="absolute" top="-4px" right="-4px" />
                        ) : null}
                    </Box>
                </Flex>
                <Box>
                    <PoolListSearch />
                </Box>
            </Flex>
            <FadeInOutBox isVisible={showFilters}>
                <Grid
                    templateColumns={{ base: 'repeat(1, 1fr)', md: '1fr 1fr 0px', lg: '1fr 1fr 1fr' }}
                    gap="0"
                    pb="4"
                    pt="2"
                >
                    <GridItem mr={{ base: '0', md: '2' }} mb={{ base: '4', md: '0' }}>
                        <PoolListTokenMultiSelect />
                    </GridItem>
                    <GridItem ml={{ base: '0', md: '2' }}>
                        <PoolListFilterMultiSelect />
                    </GridItem>
                    <GridItem display={{ base: 'none', md: 'block' }}>{/*<PoolListAttributeMultiSelect />*/}</GridItem>
                </Grid>
            </FadeInOutBox>
        </Box>
    );
}
