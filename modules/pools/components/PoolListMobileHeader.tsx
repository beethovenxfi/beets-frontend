import { Box, Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { usePoolList } from '~/modules/pools/usePoolList';
import { TextButtonPopupMenu } from '~/components/popup-menu/TextButtonPopupMenu';

export function PoolListMobileHeader() {
    const { state, setSort, refetch: refreshPoolList, showMyInvestments, setShowMyInvestments } = usePoolList();

    return (
        <Flex display={{ base: 'flex', lg: 'none' }} alignItems="center" mb="4">
            <Box color="gray.200" mr="1">
                Pools:
            </Box>
            <Box flex="1">
                <TextButtonPopupMenu
                    buttonText={
                        showMyInvestments
                            ? 'My investments'
                            : state.where?.categoryNotIn?.includes('INCENTIVIZED')
                            ? 'Community'
                            : 'Incentivized'
                    }
                    items={[
                        {
                            label: 'Incentivized pools',
                            selected: !showMyInvestments && state.where?.categoryIn?.includes('INCENTIVIZED'),
                            onClick: () => {
                                setShowMyInvestments(false);
                                refreshPoolList({
                                    ...state,
                                    skip: 0,
                                    first: 20,
                                    where: {
                                        ...state.where,
                                        categoryIn: ['INCENTIVIZED'],
                                        categoryNotIn: null,
                                        idIn: undefined,
                                    },
                                });
                            },
                        },
                        {
                            label: 'Community pools',
                            selected: !showMyInvestments && state.where?.categoryNotIn?.includes('INCENTIVIZED'),
                            onClick: () => {
                                setShowMyInvestments(false);
                                refreshPoolList({
                                    ...state,
                                    skip: 0,
                                    first: 20,
                                    where: {
                                        ...state.where,
                                        categoryIn: null,
                                        categoryNotIn: ['INCENTIVIZED'],
                                        idIn: undefined,
                                    },
                                });
                            },
                        },
                        {
                            label: 'My investments',
                            selected: showMyInvestments,
                            onClick: () => setShowMyInvestments(true),
                        },
                    ]}
                />
            </Box>
            <Box mr="4">
                <TextButtonPopupMenu
                    buttonText="Sort"
                    items={[
                        {
                            label: 'TVL',
                            onClick: () => setSort('totalLiquidity', 'desc'),
                            selected: state.orderBy === 'totalLiquidity',
                        },
                        {
                            label: 'Volume (24h)',
                            onClick: () => setSort('volume24h', 'desc'),
                            selected: state.orderBy === 'volume24h',
                        },
                        {
                            label: 'APR',
                            onClick: () => setSort('apr', 'desc'),
                            selected: state.orderBy === 'apr',
                        },
                    ]}
                />
            </Box>
            <Menu>
                <MenuButton
                    fontSize="lg"
                    userSelect="none"
                    color="beets.green"
                    fontWeight="bold"
                    _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                    <Box>Filter</Box>
                </MenuButton>
                <MenuList bgColor="beets.base.800" borderColor="gray.400" shadow="lg">
                    <MenuItem display="flex" flexDir="column" alignItems="flex-start">
                        <Flex alignItems="center">
                            <Box mr="1">TODO</Box>
                        </Flex>
                    </MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
}
