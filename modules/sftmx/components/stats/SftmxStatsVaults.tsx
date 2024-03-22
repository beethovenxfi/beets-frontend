import { Box } from '@chakra-ui/react';
import { GqlSftmxStakingData } from '~/apollo/generated/graphql-codegen-generated';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import SftmxStatsVaultsHeader from './SftmxStatsVaultsHeader';
import SftmxStatsVaultsRow from './SftmxStatsVaultsRow';
import { sortBy } from 'lodash';

interface Props {
    data: GqlSftmxStakingData;
}

export function SftmxStatsVaults({ data }: Props) {
    const vaults = sortBy(data.vaults, 'unlockTimestamp');

    return (
        <Box mt="4">
            <PaginatedTable
                width="full"
                items={vaults}
                loading={false}
                renderTableHeader={() => <SftmxStatsVaultsHeader />}
                renderTableRow={(item, index) => <SftmxStatsVaultsRow vault={item} />}
                hidePageSizeChange
            />
        </Box>
    );
}
