import { Box, Flex } from '@chakra-ui/react';
import { Divider, VStack } from '@chakra-ui/layout';
import { numberFormatLargeUsdValue } from '~/lib/util/number-formats';
import { PercentChangeBadge } from '~/components/badge/PercentChangeBadge';
import { format, formatDistanceToNow } from 'date-fns';
import { CardRow } from '~/components/card/CardRow';
import { Fragment } from 'react';

interface Props {
    title: string;
    stats: { label: string; value: string; currentValue: string | number; timestamp: number }[];
}

export function PoolDetailUsdStatsWithDate({ title, stats }: Props) {
    return (
        <CardRow flexDirection="column">
            <Box fontWeight="semibold">{title}</Box>
            <Box ml="4" mt="2">
                {stats.map(({ label, value, currentValue, timestamp }, index) => {
                    const valueNum = parseFloat(value);
                    const currentValueNum = typeof currentValue === 'string' ? parseFloat(currentValue) : currentValue;
                    const date = new Date(timestamp * 1000);

                    return (
                        <Fragment key={`stat-${index}`}>
                            <Flex>
                                <Box flex="1">{label}</Box>
                                <VStack alignItems="flex-end" spacing="0.5">
                                    <Flex alignItems="center">
                                        <Box>{numberFormatLargeUsdValue(value)}</Box>
                                        <PercentChangeBadge
                                            percentChange={Math.min((currentValueNum - valueNum) / valueNum, 1)}
                                            ml="1.5"
                                        />
                                    </Flex>
                                    <Box fontSize="sm" color="gray.200">
                                        {format(date, 'MMM. d, yy')} ({formatDistanceToNow(date, { addSuffix: true })})
                                    </Box>
                                </VStack>
                            </Flex>
                            {index < stats.length - 1 && <Divider mt="2" mb="2" />}
                        </Fragment>
                    );
                })}
            </Box>
        </CardRow>
    );
}
