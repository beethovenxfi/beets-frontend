import { Box, BoxProps } from '@chakra-ui/react';
import { InfoButton } from '~/components/info-button/InfoButton';
import { BeetsBox } from '~/components/box/BeetsBox';
import { usePool } from '~/modules/pool/lib/usePool';
import { BeetsBoxLineItem } from '~/components/box/BeetsBoxLineItem';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import numeral from 'numeral';
import { BeetsSkeleton } from '~/components/skeleton/BeetsSkeleton';

interface Props extends BoxProps {}

export function PoolWithdrawSummary({ ...rest }: Props) {
    const { pool } = usePool();

    return (
        <BeetsBox {...rest}>
            <BeetsBoxLineItem leftContent={<Box>Total</Box>} rightContent={<Box>{numberFormatUSDValue('0.0')}</Box>} />
            <BeetsBoxLineItem
                leftContent={
                    <InfoButton
                        label="Price impact"
                        moreInfoUrl="https://docs.beets.fi"
                        infoText="Nunc rutrum aliquet ligula ut tincidunt. Nulla ligula justo, laoreet laoreet convallis et, lacinia non turpis. Duis consectetur sem risus, in lobortis est congue id."
                    />
                }
                rightContent={
                    false ? <BeetsSkeleton height="24px" width="64px" /> : <Box>{numeral(0).format('0.00%')}</Box>
                }
                last={true}
            />
        </BeetsBox>
    );
}
