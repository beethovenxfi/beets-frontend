import { Box } from '@chakra-ui/react';
import Card from '~/components/card/Card';
import { useSftmxGetStakingData } from '../../lib/useSftmxGetStakingData';
import { SftmxChartsFtmValidator } from '../charts/SftmxChartsFtmValidator';
import { groupBy, sumBy } from 'lodash';

export function SftmxStatsFtmValidator() {
    const { data, loading: isLoading } = useSftmxGetStakingData();
    const validatorsGroupedAndSummed = groupBy(data?.sftmxGetStakingData.vaults, 'validatorId');
    const totalFtmAmounts = Object.keys(validatorsGroupedAndSummed).map((key) => ({
        name: key,
        value: sumBy(validatorsGroupedAndSummed[key].map((value) => parseFloat(value.ftmAmountStaked))),
    }));

    return (
        <Card shadow="lg" h="full" p="4" title="FTM per validator">
            <Card h="full" w="full" p="4">
                <Box height="full">{data && <SftmxChartsFtmValidator data={totalFtmAmounts} />}</Box>
            </Card>
        </Card>
    );
}
