import PoolInvestForm from '~/modules/pool/invest/components/PoolInvestForm';
import { PoolInvestStakeForm } from '~/modules/pool/invest/components/PoolInvestStakeForm';
import { usePoolUserPoolTokenBalances } from '~/modules/pool/lib/usePoolUserPoolTokenBalances';
import { BeetsAccordion } from '~/components/accordion/BeetsAccordion';
import { usePool } from '~/modules/pool/lib/usePool';

export function PoolInvestActions() {
    const { pool } = usePool();
    const { hasBptInWallet } = usePoolUserPoolTokenBalances();
    const items = [{ headline: 'Invest in pool', content: <PoolInvestForm />, disabled: false }];

    if (pool.staking) {
        items.push({ headline: 'Stake BPT', content: <PoolInvestStakeForm />, disabled: !hasBptInWallet });
    }

    return <BeetsAccordion flex="1" mx="8" defaultIndex={hasBptInWallet ? 1 : 0} items={items} />;
}
