import React from 'react';
import { Box, BoxProps, Button, Flex, IconButton, Select, Spinner, Text } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import Pagination from 'rc-pagination';
import { AnimatedBox } from '../animation/chakra';

interface Props<T> extends BoxProps {
    items: T[];
    currentPage?: number;
    pageSize?: number;
    count?: number;
    loading: boolean;
    fetchingMore: boolean;
    hidePageSizeChange?: boolean;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    renderTableHeader: () => React.ReactNode;
    renderTableRow: (item: T, index: number) => React.ReactNode;
    onFetchMore?: () => void;
    isInfinite?: boolean;
    isShort?: boolean;
}

export function PaginatedTable({
    items,
    loading,
    hidePageSizeChange,
    onPageChange,
    onPageSizeChange,
    fetchingMore,
    currentPage,
    count,
    pageSize,
    renderTableRow,
    renderTableHeader,
    isInfinite,
    onFetchMore,
    isShort,
    ...rest
}: Props<any>) {
    const isLoadingRows = loading && items.length === 0;

    return (
        <Box {...rest}>
            {renderTableHeader()}
            <Box mb={4} borderBottomLeftRadius="md" borderBottomRightRadius="md" overflow="hidden" shadow="lg">
                {isLoadingRows && (
                    <Flex justifyContent={'center'} py={32} bg="box.500">
                        <Spinner size="xl" />
                    </Flex>
                )}
                {!isLoadingRows && items.length === 0 && (
                    <Box height="md" display="flex" alignItems="center" justifyContent="center" bg="box.500">
                        No results found for your search criteria.
                    </Box>
                )}
                {!isLoadingRows &&
                    items.map((item, index) => (
                        <AnimatedBox
                            animate={{ opacity: 1, transition: { delay: index * 0.02 } }}
                            initial={{ opacity: 0 }}
                            key={`${item.id}-${index}`}
                        >
                            {renderTableRow(item, index)}
                        </AnimatedBox>
                    ))}
            </Box>
            {!isInfinite && (
                <Flex>
                    <Flex flex={1} alignItems="center" justifyContent="flex-start">
                        {hidePageSizeChange ? null : (
                            <>
                                <Box>
                                    <Select
                                        value={pageSize}
                                        onChange={(event) => {
                                            onPageSizeChange && onPageSizeChange(parseInt(event.target.value));
                                        }}
                                    >
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                        <option value="100">100</option>
                                    </Select>
                                </Box>
                                <Text ml={2}>per page</Text>
                            </>
                        )}
                    </Flex>
                    <Pagination
                        onChange={onPageChange}
                        defaultCurrent={1}
                        total={count}
                        pageSize={pageSize}
                        itemRender={(pageNumber, type, element) => {
                            if (type === 'prev') {
                                return (
                                    <IconButton
                                        aria-label="previous"
                                        icon={<ChevronLeft />}
                                        borderTopRightRadius={0}
                                        borderBottomRightRadius={0}
                                    />
                                );
                            } else if (type === 'next') {
                                return (
                                    <IconButton
                                        aria-label="next"
                                        icon={<ChevronRight />}
                                        borderTopLeftRadius={0}
                                        borderBottomLeftRadius={0}
                                    />
                                );
                            } else if (type === 'jump-prev') {
                                return <Button borderRadius={0}>...</Button>;
                            } else if (type === 'jump-next') {
                                return <Button borderRadius={0}>...</Button>;
                            }

                            const selected = pageNumber === currentPage;

                            return (
                                <Button borderRadius={0} color={selected ? 'beets.highlight' : undefined}>
                                    {element}
                                </Button>
                            );
                        }}
                    />
                </Flex>
            )}
            {!isShort && isInfinite && (
                <Flex justifyContent="center" width="full">
                    <Button variant="primary" isLoading={fetchingMore} onClick={onFetchMore}>
                        Load More
                    </Button>
                </Flex>
            )}
        </Box>
    );
}
