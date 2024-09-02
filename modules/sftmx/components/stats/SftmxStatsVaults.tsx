import { sortBy } from 'lodash';
import { useSftmxGetStakingData } from '../../lib/useSftmxGetStakingData';
import Card from '~/components/card/Card';
import { VStack, useBreakpointValue } from '@chakra-ui/react';
import { useState, useEffect, useMemo } from 'react';
import { GqlSftmxStakingVault } from '~/apollo/generated/graphql-codegen-generated';
import { SftmxTableVaults } from '../table/SftmxTableVaults';

export function SftmxStatsVaults() {
    const { data, loading: isLoading } = useSftmxGetStakingData();
    const isMobile = useBreakpointValue({ base: true, md: false });

    const skip = useMemo(() => {
        return isMobile ? 5 : 11;
    }, [isMobile]);

    // keep original vaults data in order for table
    const vaults = sortBy(data?.sftmxGetStakingData.vaults, 'unlockTimestamp');

    // set first (starting) row in table
    const [first, setFirst] = useState(0);
    // set inital rows for view in table (slice from vaults)
    const [vaultsView, setVaultsView] = useState<GqlSftmxStakingVault[] | undefined>();

    useEffect(() => {
        // determine first (starting) row in table
        const start = first * skip;

        // if there are less than 10 rows left in vaults, else show all 10 rows
        if (vaults.length - skip - start < 0) {
            setVaultsView(vaults.slice(start));
        } else {
            setVaultsView(vaults.slice(start, start + skip));
        }
    }, [first]);

    useEffect(() => {
        if (!isLoading) {
            setVaultsView(vaults.slice(first, skip));
        }
    }, [isLoading]);

    return (
        <VStack align="flex-start" w="full" h="full">
            <Card shadow="lg" h="full" p="4" title="FTM vaults" w="full">
                <SftmxTableVaults
                    isLoading={isLoading || !data}
                    items={vaultsView}
                    count={vaults.length}
                    currentPage={first + 1}
                    onPageChange={(page: number) => {
                        setFirst(page - 1);
                    }}
                    pageSize={skip}
                />
            </Card>
        </VStack>
    );
}
