import { VStack, Heading, Text, HStack } from '@chakra-ui/react';
import { WalletConnectButton } from '~/components/button/WalletConnectButton';
import Card from '~/components/card/Card';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useSftmxGetWithdrawalRequests } from './hooks/useSftmxGetWithdrawalRequests';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import SftmxWithdrawalRequestsHeader from './SftmxWithdrawalRequestsHeader';
import SftmxWithdrawalRequestsRow from './SftmxWithdrawalRequestsRow';
import { useSftmxGetStakingData } from './hooks/useSftmxGetStakingData';
import { orderBy } from 'lodash';
import { InfoButton } from '~/components/info-button/InfoButton';

export default function SftmxWithdrawTab() {
    const { isConnected } = useUserAccount();
    const { data: requestsData, loading: isLoading } = useSftmxGetWithdrawalRequests();
    const { data: stakingData } = useSftmxGetStakingData();

    const requests = orderBy(requestsData?.sftmxGetWithdrawalRequests, 'requestTimestamp', 'desc');

    return (
        <Card shadow="lg" h="full">
            {!isConnected && (
                <VStack h="full" justifyContent="center" alignItems="center">
                    <WalletConnectButton width="200px" size="lg" />
                </VStack>
            )}
            {isConnected && requests && stakingData && (
                <VStack spacing="4" p="4" align="flex-start" h="full">
                    <HStack>
                        <Heading size="md">Withdrawal requests</Heading>
                        <InfoButton infoText="If you have just unstaked FTM it can take up to 5 minutes before your request is visible here." />
                    </HStack>
                    <PaginatedTable
                        isInfinite
                        isShort
                        width="full"
                        items={requests}
                        loading={isLoading}
                        renderTableHeader={() => <SftmxWithdrawalRequestsHeader />}
                        renderTableRow={(item, index) => (
                            <SftmxWithdrawalRequestsRow
                                item={item}
                                withdrawalDelay={stakingData.sftmxGetStakingData.withdrawalDelay}
                            />
                        )}
                        noResultLabel="No withdrawal requests found!"
                    />
                </VStack>
            )}
        </Card>
    );
}
