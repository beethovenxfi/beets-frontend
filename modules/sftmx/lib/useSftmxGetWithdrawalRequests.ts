import { useSftmxGetWithdrawalRequestsQuery } from '~/apollo/generated/graphql-codegen-generated';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { AddressZero } from '@ethersproject/constants';

export function useSftmxGetWithdrawalRequests() {
    const { userAddress } = useUserAccount();

    const { data, ...rest } = useSftmxGetWithdrawalRequestsQuery({
        variables: { user: (userAddress || AddressZero) as string },
    });

    return { data, ...rest };
}
