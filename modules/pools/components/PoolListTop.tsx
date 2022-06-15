import { Box, Flex, IconButton } from '@chakra-ui/react';
import { PoolListTabs } from '~/modules/pools/components/PoolListTabs';
import { PoolListSearch } from '~/modules/pools/components/PoolListSearch';
import { Filter } from 'react-feather';
import { PoolListTokenMultiSelect } from '~/modules/pools/components/PoolListTokenMultiSelect';
import { PoolListFilterMultiSelect } from '~/modules/pools/components/PoolListFilterMultiSelect';
import { PoolListAttributeMultiSelect } from '~/modules/pools/components/PoolListAttributeMultiSelect';
import { useBoolean } from '@chakra-ui/hooks';

export function PoolListTop() {
    const [filtersVisible, { toggle }] = useBoolean(false);

    return (
        <Box>
            <Flex pb={4}>
                <Flex flex={1}>
                    <PoolListTabs />
                    <IconButton
                        aria-label="filter-button"
                        icon={<Filter />}
                        ml={4}
                        onClick={toggle}
                        color={filtersVisible ? 'gray.100' : 'white'}
                        bgColor={filtersVisible ? 'beets.base.300' : 'beets.lightAlpha.200'}
                        _hover={{ bgColor: 'beets.light' }}
                    />
                </Flex>
                <Box>
                    <PoolListSearch />
                </Box>
            </Flex>
            {filtersVisible ? (
                <Flex pt={2} pb={4} alignItems="center">
                    <Box flex={1} mr={2}>
                        <PoolListTokenMultiSelect />
                    </Box>
                    <Box flex={1} mx={2}>
                        <PoolListFilterMultiSelect />
                    </Box>
                    <Box flex={1} ml={2}>
                        {/*<PoolListAttributeMultiSelect />*/}
                    </Box>
                </Flex>
            ) : null}
        </Box>
    );
}
