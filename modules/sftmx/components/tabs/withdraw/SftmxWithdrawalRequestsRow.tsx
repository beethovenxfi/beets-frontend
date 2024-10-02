import { Grid, GridItem, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { GqlSftmxWithdrawalRequests } from '~/apollo/generated/graphql-codegen-generated';
import { SftmxWithdrawButton } from './SftmxWithdrawButton';
import { useSftmxGetAllWithdrawalRequests } from '../../../lib/useSftmxGetAllWithdrawalRequests';
import { useEffect, useState } from 'react';
import numeral from 'numeral';

interface Props {
    item: GqlSftmxWithdrawalRequests;
    withdrawalDelay: number;
}

export default function SftmxWithdrawalRequestsRow({ item, withdrawalDelay }: Props) {
    const [isWithdrawn, setIsWithdrawn] = useState(item.isWithdrawn);
    const availableForWithdrawalTime = (item.requestTimestamp + withdrawalDelay) * 1000;
    const now = Date.now();
    const { data, refetch, isRefetching } = useSftmxGetAllWithdrawalRequests(item.id);

    useEffect(() => {
        if (!isRefetching && data) {
            setIsWithdrawn(data.isWithdrawn);
        }
    }, [isRefetching, data]);

    return (
        <Grid
            alignItems="center"
            templateColumns={'repeat(3, 1fr)'}
            gap="0"
            bgColor="rgba(255,255,255,0.05)"
            p="4"
            h="64px"
        >
            <GridItem>
                <Text as={isWithdrawn ? 'del' : undefined}>{numeral(item.amountSftmx).format('0.[000]a')} sFTMx</Text>
            </GridItem>
            <GridItem justifySelf="flex-end">
                <Text as={isWithdrawn ? 'del' : undefined}>
                    {format(new Date(availableForWithdrawalTime), 'dd/MM/yyyy HH:mm')}
                </Text>
            </GridItem>
            <GridItem justifySelf="flex-end" w="75%">
                <SftmxWithdrawButton
                    inline
                    amount={item.amountSftmx}
                    wrId={item.id}
                    isDisabled={now < availableForWithdrawalTime || isWithdrawn}
                    isWithdrawn={isWithdrawn}
                    onConfirmed={() => refetch()}
                />
            </GridItem>
        </Grid>
    );
}
