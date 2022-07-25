import { BoxProps, VStack } from '@chakra-ui/react';
import Card from '~/components/card/Card';
import { PoolDetailBptPriceChart } from '~/modules/pool/detail/components/charts/PoolDetailBptPriceChart';

interface Props extends BoxProps {}

export function PoolDetailCharts({ ...rest }: Props) {
    return (
        <Card width="full" display="flex" alignItems="center" justifyContent="center" height="full">
            <VStack width="full" height="full">
                <PoolDetailBptPriceChart />
            </VStack>
        </Card>
    );
}
