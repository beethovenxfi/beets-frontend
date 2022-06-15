import { Box, Flex, Text } from '@chakra-ui/react';
import { MultiSelect } from '~/components/multi-select/MultiSelect';
import { usePoolList } from '~/modules/pools/usePoolList';

export function PoolListFilterMultiSelect() {
    const { filters, refetch, state } = usePoolList();
    const selected = state.where?.filterIn || [];

    return (
        <Box>
            <MultiSelect
                options={filters.map((filter) => ({
                    value: filter.id,
                    label: filter.title,
                }))}
                value={filters
                    .filter((filter) => selected.includes(filter.id))
                    .map((filter) => ({
                        value: filter.id,
                        label: filter.title,
                    }))}
                renderOption={(data) => (
                    <>
                        <Text fontSize="lg">{data.label}</Text>
                    </>
                )}
                renderMultiValue={(data, children) => <Flex alignItems="center">{children}</Flex>}
                placeholder="Filter by category..."
                onChange={(selected) => {
                    refetch({
                        ...state,
                        where: {
                            ...state.where,
                            filterIn: selected.length > 0 ? selected.map((item) => item.value) : null,
                        },
                    });
                }}
            />
        </Box>
    );
}
