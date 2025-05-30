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
    const hasFiltersSelected = searchText !== '';

    return (
        <Flex display={{ base: 'flex', lg: 'none' }} alignItems="center" mb="4">
            <Box color="gray.200" mr="1">
                Pools:
            </Box>
            <Box flex="1">
                <TextButtonPopupMenu
                    buttonText={showMyInvestments ? 'My investments' : 'All pools'}
                    items={[
                        {
                            label: 'All pools',
                            selected: !showMyInvestments && state.where?.tagNotIn?.includes('INCENTIVIZED'),
                            onClick: () => {
                                setShowMyInvestments(false);
                                refreshPoolList({
                                    ...state,
                                    skip: 0,
                                    first: 20,
                                    where: {
                                        ...state.where,
                                        tagIn: null,
                                        tagNotIn: ['INCENTIVIZED'],
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
                <Box>Search</Box>
                {hasFiltersSelected ? (
                    <Circle size="1.5" bg="red.500" opacity="0.85" position="absolute" top="4px" right="-6px" />
                ) : null}
            </Link>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Search</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box mb="8">
                            <PoolListSearch />
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
}
