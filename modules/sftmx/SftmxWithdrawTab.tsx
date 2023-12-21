import { VStack, Heading, Text } from '@chakra-ui/react';
import { WalletConnectButton } from '~/components/button/WalletConnectButton';
import Card from '~/components/card/Card';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useSftmxGetWithdrawalRequests } from './useSftmxGetWithdrawalRequests';
import { PaginatedTable } from '~/components/table/PaginatedTable';
import SftmxWithdrawalRequestsHeader from './SftmxWithdrawalRequestsHeader';
import SftmxWithdrawalRequestsRow from './SftmxWithdrawalRequestsRow';
import { useSftmxGetStakingData } from './useSftmxGetStakingData';

export default function SftmxWithdrawTab() {
    const { isConnected } = useUserAccount();
    const { data: requestsData, loading: isLoading } = useSftmxGetWithdrawalRequests();
    const { data: stakingData } = useSftmxGetStakingData();

    const requests = requestsData?.sftmxGetWithdrawalRequests;

    return (
        <Card shadow="lg" h="full">
            {!isConnected && (
                <VStack h="full" justifyContent="center" alignItems="center">
                    <WalletConnectButton width="200px" size="lg" />
                </VStack>
            )}
            {isConnected && requests && stakingData && (
                <VStack spacing="4" p={{ base: '4', lg: '8' }} align="flex-start" h="full">
                    <Heading size="md">Withdrawal requests</Heading>
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
