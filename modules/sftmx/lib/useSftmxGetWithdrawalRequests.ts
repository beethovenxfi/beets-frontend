import { useQuery } from 'react-query';
import { useSftmxGetWithdrawalRequestsQuery } from '~/apollo/generated/graphql-codegen-generated';
import { useUserAccount } from '~/lib/user/useUserAccount';

export function useSftmxGetWithdrawalRequests() {
    const { userAddress } = useUserAccount();

    const query = useQuery(
        ['sftmxGetWithdrawalRequests', userAddress],
        async () => {
            const { data, ...rest } = useSftmxGetWithdrawalRequestsQuery({
                variables: { user: userAddress as string },
            });

            return { data, ...rest };
        },
        { enabled: !!userAddress },
    );

    return {
        ...query,
        data: query.data?.data?.sftmxGetWithdrawalRequests || [],
        startPolling: query.data?.startPolling,
        stopPolling: query.data?.stopPolling,
    };
}
