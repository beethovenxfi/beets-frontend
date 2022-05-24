import { IconButton, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Search } from 'react-feather';
import { usePoolList } from '~/modules/pools/usePoolList';
import { useBoolean } from '@chakra-ui/hooks';
import { debounce } from 'lodash';

export function PoolListSearch() {
    const [isSearching, { on, off }] = useBoolean();
    const { refetch, state } = usePoolList();

    const submitSearch = debounce(async () => {
        await refetch({ ...state });
        off();
    }, 250);

    return (
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
                    isLoading={false}
                />
            </InputRightElement>
        </InputGroup>
    );
}
