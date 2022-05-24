import { IconButton, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Search, X } from 'react-feather';
import { usePoolList } from '~/modules/pools/usePoolList';
import { useBoolean } from '@chakra-ui/hooks';
import { debounce } from 'lodash';
import { useState } from 'react';

export function PoolListSearch() {
    const [isSearching, { on, off }] = useBoolean();
    const { refetch, state } = usePoolList();
    const [searchText, setSearchText] = useState('');

    const submitSearch = debounce(async () => {
        await refetch({ ...state, textSearch: searchText || null, skip: 0 });
        off();
    }, 250);

    return (
        <InputGroup size="md">
            <Input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => {
                    setSearchText(e.target.value);
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
                    icon={searchText !== '' ? <X color="white" /> : <Search color="white" />}
                    isLoading={isSearching}
                    _loading={{ color: 'white' }}
                    onClick={() => {
                        if (searchText !== '') {
                            setSearchText('');
                            refetch({ ...state, textSearch: null, skip: 0 });
                        }
                    }}
                />
            </InputRightElement>
        </InputGroup>
    );
}
