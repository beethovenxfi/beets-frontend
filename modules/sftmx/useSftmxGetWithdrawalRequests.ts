import { useSftmxGetWithdrawalRequestsQuery } from '~/apollo/generated/graphql-codegen-generated';
import { useUserAccount } from '~/lib/user/useUserAccount';

export function useSftmxGetWithdrawalRequests() {
    const { userAddress } = useUserAccount();
    const { data, ...rest } = useSftmxGetWithdrawalRequestsQuery({ variables: { user: userAddress as string } });

    return {
        ...rest,
        data,
    };
}
