import PoolInvestForm from '~/modules/pool/invest/components/PoolInvestForm';
import { PoolInvestStakeForm } from '~/modules/pool/invest/components/PoolInvestStakeForm';
import { usePoolUserPoolTokenBalances } from '~/modules/pool/lib/usePoolUserPoolTokenBalances';
import { BeetsAccordion } from '~/components/accordion/BeetsAccordion';

export function PoolInvestActions() {
    const { hasBptInWallet } = usePoolUserPoolTokenBalances();

    return (
        <BeetsAccordion
            flex="1"
            mx="8"
            defaultIndex={hasBptInWallet ? 1 : 0}
            items={[
                { headline: 'Invest in pool', content: <PoolInvestForm />, disabled: false },
                { headline: 'Stake BPT in Farm', content: <PoolInvestStakeForm />, disabled: !hasBptInWallet },
            ]}
        />
    );
}
