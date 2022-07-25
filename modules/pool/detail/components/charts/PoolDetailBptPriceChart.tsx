import { useState } from 'react';
import { TokenPriceLineChart } from '~/components/charts/TokenPriceLineChart';
import { GqlTokenChartDataRange, useGetPoolBptPriceChartDataQuery } from '~/apollo/generated/graphql-codegen-generated';
import { usePool } from '~/modules/pool/lib/usePool';

interface Props {}

export function PoolDetailBptPriceChart({}: Props) {
    const { pool } = usePool();
    const [range, setRange] = useState<GqlTokenChartDataRange>('SEVEN_DAY');
    const { data } = useGetPoolBptPriceChartDataQuery({ variables: { address: pool.address, range } });

    return <TokenPriceLineChart label="Share price" prices={data?.prices || []} />;
}
