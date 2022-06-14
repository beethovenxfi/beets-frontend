import { Divider, HStack, Text, VStack, Badge } from '@chakra-ui/layout';
import Card from '~/components/card/Card';
import { usePool } from '../../../lib/usePool';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { usePoolUserPoolTokenBalances } from '~/modules/pool/lib/usePoolUserPoolTokenBalances';
import PoolUserStats from './PoolUserStats';
import PoolOverallStats from './PoolOverallStats';

export default function PoolStats() {
    const { isLoading, hasBpt } = usePoolUserPoolTokenBalances();
    const { pool, poolTokensWithoutPhantomBpt } = usePool();

    return (
        <Card padding="4" minWidth="300px" width="300px" height="full">
            {
                hasBpt && <PoolUserStats />
            }
            {
                !hasBpt && <PoolOverallStats />
            }
        </Card>
    );
}
