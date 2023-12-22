import { Grid, GridItem } from '@chakra-ui/react';
import { format } from 'date-fns';
import { GqlSftmxWithdrawalRequests } from '~/apollo/generated/graphql-codegen-generated';
import { SftmxWithdrawButton } from './SftmxWithdrawButton';

interface Props {
    item: GqlSftmxWithdrawalRequests;
    withdrawalDelay: number;
}

export default function SftmxWithdrawalRequestsRow({ item, withdrawalDelay }: Props) {
    const availableForWithdrawalTime = (item.requestTimestamp + withdrawalDelay) * 1000;
    const now = Date.now();

    return (
        <Grid alignItems="center" templateColumns={'repeat(3, 1fr)'} gap="0" bgColor="rgba(255,255,255,0.05)" p="4">
            <GridItem>{item.amountSftmx} sFTMX</GridItem>
            <GridItem justifySelf="flex-end">
                {format(new Date(availableForWithdrawalTime), 'dd/MM/yyyy HH:mm')}
            </GridItem>
            <GridItem justifySelf="flex-end">
                <SftmxWithdrawButton
                    amount={item.amountSftmx}
                    wrId={item.id}
                    isDisabled={now < availableForWithdrawalTime}
                />
            </GridItem>
        </Grid>
    );
}
