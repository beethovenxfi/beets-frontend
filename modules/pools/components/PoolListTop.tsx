import { Box, Button, Circle, Flex, Grid, GridItem, HStack, IconButton, Link } from '@chakra-ui/react';
import { PoolListTabs } from '~/modules/pools/components/PoolListTabs';
import { PoolListSearch } from '~/modules/pools/components/PoolListSearch';
import { Filter } from 'react-feather';
import { PoolListTokenMultiSelect } from '~/modules/pools/components/PoolListTokenMultiSelect';
import { usePoolList } from '~/modules/pools/usePoolList';
import { FadeInOutBox } from '~/components/animation/FadeInOutBox';

export function PoolListTop() {
    const { showFilters, toggleFilterVisibility, state } = usePoolList();
    const hasFiltersSelected = (state.where?.tokensIn || []).length > 0;

    return (
        <Box display={{ base: 'none', lg: 'block' }}>
            <HStack pb="4" justifyContent="space-between">
                <HStack>
                    <PoolListTabs />
                    <Box position="relative">
                        <IconButton
                            aria-label="filter-button"
                            icon={<Filter />}
                            ml="2"
                            onClick={toggleFilterVisibility}
                            color={showFilters ? 'gray.100' : 'white'}
                            bgColor={showFilters ? 'beets.base.300' : 'beets.lightAlpha.300'}
                            _hover={{ bgColor: 'beets.light' }}
                        />
                        {hasFiltersSelected && (
                            <Circle size="3" bg="red.500" opacity="0.85" position="absolute" top="-4px" right="-4px" />
                        )}
                    </Box>
                    <PoolListSearch />
                </HStack>
                <Link href="/compose">
                    <Button variant="primary">Create a pool</Button>
                </Link>
            </HStack>
            <FadeInOutBox isVisible={showFilters}>
                <Grid templateColumns={{ base: '1fr', md: '1fr 0px', lg: '1fr 1fr' }} gap="0" pb="4" pt="2">
                    <GridItem mr={{ base: '0', md: '2' }} mb={{ base: '4', md: '0' }}>
                        <PoolListTokenMultiSelect />
                    </GridItem>
                    <GridItem display={{ base: 'none', md: 'block' }}>{/*<PoolListAttributeMultiSelect />*/}</GridItem>
                </Grid>
            </FadeInOutBox>
        </Box>
    );
}
