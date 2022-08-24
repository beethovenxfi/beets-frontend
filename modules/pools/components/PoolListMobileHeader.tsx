import {
    Box,
    Circle,
    Flex,
    Link,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react';
import { usePoolList } from '~/modules/pools/usePoolList';
import { TextButtonPopupMenu } from '~/components/popup-menu/TextButtonPopupMenu';
import { PoolListTokenMultiSelect } from '~/modules/pools/components/PoolListTokenMultiSelect';
import { PoolListFilterMultiSelect } from '~/modules/pools/components/PoolListFilterMultiSelect';
import { PoolListSearch } from '~/modules/pools/components/PoolListSearch';

export function PoolListMobileHeader() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        state,
        setSort,
        refetch: refreshPoolList,
        showMyInvestments,
        setShowMyInvestments,
        searchText,
    } = usePoolList();
    const hasFiltersSelected =
        (state.where?.filterIn || []).length > 0 || (state.where?.tokensIn || []).length > 0 || searchText !== '';

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
            <Link onClick={onOpen} fontSize="lg" color="beets.green" fontWeight="bold" position="relative">
                <Box>Filter</Box>
                {hasFiltersSelected ? (
                    <Circle size="1.5" bg="red.500" opacity="0.85" position="absolute" top="4px" right="-6px" />
                ) : null}
            </Link>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Filters</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box mb="6">
                            <Box mb="1">Tokens:</Box>
                            <PoolListTokenMultiSelect />
                        </Box>
                        <Box mb="8">
                            <Box mb="1">Categories:</Box>
                            <PoolListFilterMultiSelect />
                        </Box>
                        <Box mb="8">
                            <Box mb="1">Search:</Box>
                            <PoolListSearch />
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
}
