/* eslint-disable react/jsx-key */
import { Box, HStack, Progress, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { ChevronDown, ChevronUp, CornerDownRight } from 'react-feather';
import { useExpanded, useTable } from 'react-table';

import Card from '~/components/card/Card';
import React from 'react';
import TokenAvatar from '~/components/token/TokenAvatar';
import numeral from 'numeral';
import { poolGetTokensWithoutPhantomBpt } from '~/lib/services/pool/pool-util';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { useGetTokens } from '~/lib/global/useToken';
import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { usePoolUserInvestedTokenBalances } from '~/modules/pool/lib/usePoolUserInvestedTokenBalances';

interface PoolCompositionTableProps {
    columns: any;
    data: any;
    hasNestedTokens: boolean;
    hasBpt: boolean;
}

interface TableDataTemplate {
    symbol: string;
    name: string;
    weight: number;
    myBalance: string;
    myValue: string;
    balance: string;
    value: string;
}

interface TableData extends TableDataTemplate {
    subRows?: TableDataTemplate[];
}

enum Columns {
    Expander = 'expander',
    Symbol = 'symbol',
    Name = 'name',
    Weight = 'weight',
    MyBalance = 'myBalance',
    MyValue = 'myValue',
    Balance = 'balance',
    Value = 'value',
}

const PoolCompositionTable = ({ columns, data, hasBpt, hasNestedTokens }: PoolCompositionTableProps) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        allColumns,
        state: { expanded },
    } = useTable(
        {
            columns,
            data,
        },
        useExpanded,
    );

    function parseCell(cell: any) {
        if (cell.column.id === Columns.Expander && !hasNestedTokens) {
            cell.column.toggleHidden(true);
        } else if (cell.column.id === Columns.Symbol) {
            const value = cell.value.split('--');
            return (
                <HStack>
                    {cell.row.depth > 0 ? (
                        <Box color="whiteAlpha.400" paddingLeft={cell.row.depth === 0 ? '2' : cell.row.depth * 8}>
                            <CornerDownRight />
                        </Box>
                    ) : null}
                    <TokenAvatar size="xs" address={value[1]} />
                    <Text fontSize="sm" color="beets.base.50">
                        {value[0]}
                    </Text>
                </HStack>
            );
        } else if (cell.column.id === Columns.Weight) {
            if (cell.row.depth === 0) {
                return <Progress width="80%" rounded="lg" value={parseFloat(cell.value || '0') * 100} />;
            } else {
                return null;
            }
        } else if (cell.column.id === Columns.MyBalance || cell.column.id === Columns.MyValue) {
            if (!hasBpt) {
                cell.column.toggleHidden(true);
            } else if (cell.row.depth > 0) {
                return null;
            } else {
                return cell.render('Cell');
            }
        } else {
            return cell.render('Cell');
        }
    }

    return (
        <TableContainer>
            <Table {...getTableProps()} style={{ borderCollapse: 'separate', borderSpacing: '0 3px' }}>
                <Thead width="full" paddingX="2">
                    {headerGroups.map((headerGroup) => (
                        <Tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <Th
                                    {...column.getHeaderProps()}
                                    border="none"
                                    padding={column.id === Columns.Expander ? '0' : '2'}
                                >
                                    {column.id === Columns.Expander ? (
                                        <Box color="beets.base.50">{column.render('Header')}</Box>
                                    ) : (
                                        <Text fontSize="xs" color="beets.base.50">
                                            {column.render('Header')}
                                        </Text>
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </Thead>
                <Tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            <Tr {...row.getRowProps()} padding="2" width="full" background="whiteAlpha.100">
                                {row.cells.map((cell, i) => {
                                    return (
                                        <Td
                                            {...cell.getCellProps()}
                                            borderBottom="0"
                                            p="2"
                                            marginBottom="4"
                                            borderTopLeftRadius={i == 0 ? 'lg' : undefined}
                                            borderBottomLeftRadius={i == 0 ? 'lg' : undefined}
                                            borderTopRightRadius={i == row.cells.length - 1 ? 'lg' : undefined}
                                            borderBottomRightRadius={i == row.cells.length - 1 ? 'lg' : undefined}
                                        >
                                            {parseCell(cell)}
                                        </Td>
                                    );
                                })}
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export function PoolComposition() {
    const { pool } = usePool();
    const { hasBpt } = usePoolUserBptBalance();
    const { getUserInvestedBalance } = usePoolUserInvestedTokenBalances();
    const { priceFor } = useGetTokens();
    const poolTokens = poolGetTokensWithoutPhantomBpt(pool);
    const hasNestedTokens = poolTokens.some((token) =>
        ['GqlPoolTokenLinear', 'GqlPoolTokenPhantomStable'].includes(token.__typename),
    );

    const columns = React.useMemo(
        () => [
            {
                id: 'expander',
                Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }: any) => (
                    <span {...getToggleAllRowsExpandedProps()}>
                        {isAllRowsExpanded ? <ChevronUp /> : <ChevronDown />}
                    </span>
                ),
                Cell: ({ row }: any) =>
                    row.expanded ? (
                        <span
                            {...row.getToggleRowExpandedProps({
                                style: {
                                    paddingLeft: `${row.depth * 2}rem`,
                                },
                            })}
                        >
                            <CornerDownRight />
                        </span>
                    ) : null,
            },
            {
                Header: 'Symbol',
                accessor: Columns.Symbol,
            },
            {
                Header: 'Name',
                accessor: Columns.Name,
            },
            {
                Header: 'Weight',
                accessor: Columns.Weight,
            },
            {
                Header: 'My balance',
                accessor: Columns.MyBalance,
            },
            {
                Header: 'My value',
                accessor: Columns.MyValue,
            },
            {
                Header: 'Balance',
                accessor: Columns.Balance,
            },
            {
                Header: 'Value',
                accessor: Columns.Value,
            },
        ],
        [],
    );

    // TODO: need to type
    const getTokenData = (tokens: any[]): TableData[] => {
        return tokens?.map((token: any) => {
            const userBalance = getUserInvestedBalance(token.address);
            const tokenPrice = priceFor(token.address);
            const totalTokenValue = parseFloat(token.balance) * tokenPrice;
            return {
                symbol: `${token.symbol}--${token.address}`,
                name: token.name,
                weight: token.weight ?? totalTokenValue / parseFloat(pool.dynamicData.totalLiquidity),
                myBalance: tokenFormatAmount(userBalance),
                myValue: numeral(parseFloat(userBalance) * tokenPrice).format('$0,0.00a'),
                balance: tokenFormatAmount(token.balance),
                value: numeral(totalTokenValue).format('$0,0.00a'),
                ...(hasNestedTokens && { subRows: getTokenData(token.pool?.tokens) }),
            };
        });
    };

    const data = () => [...getTokenData(pool.tokens)];

    return (
        <Card px="2" py="2" mt={4} width="full">
            <PoolCompositionTable columns={columns} data={data()} hasBpt={hasBpt} hasNestedTokens={hasNestedTokens} />
        </Card>
    );
}
