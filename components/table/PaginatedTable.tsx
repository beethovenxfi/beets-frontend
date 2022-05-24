import React from 'react';
import { Box, BoxProps, Button, Flex, IconButton, Select, Spinner, Text } from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import Pagination from 'rc-pagination';

interface Props<T> extends BoxProps {
    items: T[];
    currentPage: number;
    pageSize: number;
    count: number;
    loading: boolean;
    fetchingMore: boolean;
    hidePageSizeChange?: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    renderTableHeader: () => React.ReactNode;
    renderTableRow: (item: T, index: number) => React.ReactNode;
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
    ...rest
}: Props<any>) {
    return (
        <Box {...rest}>
            {renderTableHeader()}
            <Box mb={4} bgColor="beets.base.700" borderBottomLeftRadius="md" borderBottomRightRadius="md">
                {loading && items.length === 0 ? (
                    <Flex justifyContent={'center'} py={32}>
                        <Spinner size="xl" />
                    </Flex>
                ) : items.length > 0 ? (
                    items.map((item, index) => renderTableRow(item, index))
                ) : null}
            </Box>
            <Flex>
                <Flex flex={1} alignItems="center" justifyContent="flex-start">
                    {hidePageSizeChange ? null : (
                        <>
                            <Box>
                                <Select
                                    value={pageSize}
                                    onChange={(event) => {
                                        onPageSizeChange(parseInt(event.target.value));
                                    }}
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
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
                            <Button borderRadius={0} color={selected ? 'beets.highlight.alpha.100' : undefined}>
                                {element}
                            </Button>
                        );
                    }}
                />
            </Flex>
        </Box>
    );
}
