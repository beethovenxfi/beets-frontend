import { Alert, AlertIcon, Box, SkeletonText } from '@chakra-ui/react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useTranslation } from 'next-i18next';
import React, { useEffect } from 'react';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { useReliquaryDepositImpact } from '../../lib/useReliquaryDepositImpact';
import { useReliquaryJoinGetBptOutAndPriceImpactForTokensIn } from '../lib/useReliquaryJoinGetBptOutAndPriceImpactForTokensIn';

interface Props {
    bptIn?: string;
    totalInvestValue?: number;
    relicId?: string;
}

export function ReliquaryInvestDepositImpact({ bptIn, totalInvestValue = 0, relicId }: Props) {
    const { bptOutAndPriceImpact } = useReliquaryJoinGetBptOutAndPriceImpactForTokensIn();

    const {
        data: depositImpact,
        isFetching,
        refetch,
    } = useReliquaryDepositImpact(parseFloat(bptIn || bptOutAndPriceImpact?.minBptReceived || ''), relicId);

    const { t } = useTranslation('reliquary');

    useEffect(() => {
        if (relicId) {
            refetch();
        }
    }, [relicId]);

    return (
        <Box w="full">
            <Alert status="warning" mb="4">
                <AlertIcon alignSelf="center" />
                {!isFetching && depositImpact !== undefined ? (
                    t('reliquary.invest.depositImpact.alert', {
                        totalInvestValue: numberFormatUSDValue(totalInvestValue),
                        diffDate: formatDistanceToNowStrict(depositImpact.diffDate),
                    })
                ) : (
                    <Box w="full">
                        <SkeletonText
                            my="2"
                            startColor="beets.green"
                            endColor="beets.highlight"
                            noOfLines={3}
                            spacing="4"
                            skeletonHeight="2"
                        />
                    </Box>
                )}
            </Alert>
        </Box>
    );
}
