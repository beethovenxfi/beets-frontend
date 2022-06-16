import PoolInvestForm from '~/modules/pool/invest/components/PoolInvestForm';
import { PoolInvestStakeForm } from '~/modules/pool/invest/components/PoolInvestStakeForm';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { BeetsAccordion } from '~/components/accordion/BeetsAccordion';
import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';

export function PoolInvestActions() {
    const { pool } = usePool();
    const { hasBptInWallet } = usePoolUserBptBalance();
    const items = [{ headline: 'Invest in pool', content: <PoolInvestForm />, disabled: false }];

    if (pool.staking) {
        items.push({ headline: 'Stake BPT', content: <PoolInvestStakeForm />, disabled: !hasBptInWallet });
    }

    return <BeetsAccordion flex="1" mx="8" defaultIndex={hasBptInWallet ? 1 : 0} items={items} />;
}
