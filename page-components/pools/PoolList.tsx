import {
    Box,
    Button,
    Container,
    Flex,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Spinner,
    Switch,
    Text,
} from '@chakra-ui/react';
import { NetworkStatus } from '@apollo/client';
import { usePoolList } from './usePoolList';
import PoolListItem from '~/page-components/pools/PoolListItem';
import { Search } from 'react-feather';
import PoolListSortableHeader from '~/page-components/pools/PoolListSortableHeader';
import { debounce } from 'lodash';
import { useBoolean } from '@chakra-ui/hooks';

function PoolList() {
    const {
        pools,
        refetch,
        loading,
        error,
        fetchMore,
        networkStatus,
        state,
        toggleCommunityPools,
        isTogglingCommunityPools,
    } = usePoolList();
    const [isSearching, { on, off }] = useBoolean();

    const submitSearch = debounce(async () => {
        await refetch();
        off();
    }, 250);

    return (
        <Container bg="gray.900" shadow="lg" rounded="lg" padding="4" mb={12} maxW="7xl">
            <Box pb={4}>
                <InputGroup size="md">
                    <Input
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => {
                            state.textSearch = e.target.value.length > 0 ? e.target.value : null;
                            if (!isSearching) {
                                on();
                            }

                            submitSearch();
                        }}
                    />
                    <InputRightElement>
                        <IconButton
                            pr={4}
                            colorScheme="transparent"
                            aria-label="Search for a pool"
                            icon={<Search color="white" />}
                            isLoading={isSearching}
                        />
                    </InputRightElement>
                </InputGroup>
            </Box>
            <Flex alignItems="center" py={4}>
                <Text pr={2}>Show community pools:</Text>
                <Switch
                    disabled={isTogglingCommunityPools}
                    onChange={() => {
                        toggleCommunityPools();
                    }}
                />
            </Flex>

            <PoolListSortableHeader />
            {networkStatus === NetworkStatus.refetch ? (
                <Flex justifyContent={'center'} my={4}>
                    <Spinner size="xl" />
                </Flex>
            ) : pools ? (
                pools.map((pool, index) => <PoolListItem key={index} pool={pool} />)
            ) : null}

            <Button
                colorScheme="blue"
                isLoading={loading || networkStatus === NetworkStatus.fetchMore}
                onClick={async () => fetchMore({ variables: { skip: pools?.length } })}
                w={`100%`}
                mt={4}
            >
                Load More
            </Button>
        </Container>
    );
}

export default PoolList;
