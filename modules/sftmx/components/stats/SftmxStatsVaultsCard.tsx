import { PaginatedTable } from '~/components/table/PaginatedTable';
import SftmxStatsVaultsHeader from './SftmxStatsVaultsHeader';
import SftmxStatsVaultsRow from './SftmxStatsVaultsRow';
import { sortBy } from 'lodash';
import { useSftmxGetStakingData } from '../../lib/useSftmxGetStakingData';
import Card from '~/components/card/Card';

export function SftmxStatsVaultsCard() {
    const { data } = useSftmxGetStakingData();
    const vaults = sortBy(data?.sftmxGetStakingData.vaults || [], 'unlockTimestamp');

    return (
        <Card shadow="lg" h="full" p="4" title="FTM vaults">
            <PaginatedTable
                w="full"
                h="full"
                items={vaults}
                loading={false}
                renderTableHeader={() => <SftmxStatsVaultsHeader />}
                renderTableRow={(item) => <SftmxStatsVaultsRow vault={item} />}
                hidePageSizeChange
            />
        </Card>
    );
}
