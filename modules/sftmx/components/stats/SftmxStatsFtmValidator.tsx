import { Box } from '@chakra-ui/react';
import Card from '~/components/card/Card';
import { useSftmxGetStakingData } from '../../lib/useSftmxGetStakingData';
import { SftmxChartsFtmValidator } from '../charts/SftmxChartsFtmValidator';
import { groupBy, sortBy, sumBy } from 'lodash';

export function SftmxStatsFtmValidator() {
    const { data } = useSftmxGetStakingData();
    const validatorsGroupedAndSummed = groupBy(data?.sftmxGetStakingData.vaults, 'validatorId');
    const totalFtmAmounts = Object.keys(validatorsGroupedAndSummed).map((key) => ({
        name: key,
        value: sumBy(validatorsGroupedAndSummed[key].map((value) => parseFloat(value.ftmAmountStaked))),
        validatorAddress: validatorsGroupedAndSummed[key][0].validatorAddress.toLowerCase(),
    }));

    const totalFtmAmountsSorted = sortBy(totalFtmAmounts, 'value').reverse();

    return (
        <Card shadow="lg" h="full" p="4" title="FTM staked per validator">
            <Card h="full" w="full" p="4">
                <Box height="full">{data && <SftmxChartsFtmValidator data={totalFtmAmountsSorted} />}</Box>
            </Card>
        </Card>
    );
}
