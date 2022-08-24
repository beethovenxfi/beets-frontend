import { IconButton, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Search, X } from 'react-feather';
import { usePoolList } from '~/modules/pools/usePoolList';
import { useBoolean } from '@chakra-ui/hooks';
import { debounce } from 'lodash';
import { useEffect } from 'react';

export function PoolListSearch() {
    const [isSearching, { on, off }] = useBoolean();
    const { refetch, state, searchText, setSearchText } = usePoolList();

    const submitSearch = debounce(async () => {
        await refetch({ ...state, textSearch: searchText, skip: 0 });
        off();
    }, 250);

    useEffect(() => {
        submitSearch();
    }, [searchText]);

    return (
        <InputGroup size="md">
            <Input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => {
                    setSearchText(e.target.value);
                    if (!isSearching) on();
                }}
            />
            <InputRightElement>
                <IconButton
                    pr={4}
                    colorScheme="transparent"
                    aria-label="Search for a pool"
                    icon={searchText !== '' ? <X color="white" /> : <Search color="white" />}
                    isLoading={isSearching}
                    _loading={{ color: 'white' }}
                    onClick={() => {
                        if (searchText !== '') setSearchText('');
                    }}
                />
            </InputRightElement>
        </InputGroup>
    );
}
