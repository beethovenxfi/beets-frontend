import { useSftmxGetStakingDataQuery } from '~/apollo/generated/graphql-codegen-generated';

export function useSftmxGetStakingData() {
    const { data, ...rest } = useSftmxGetStakingDataQuery();

    return {
        ...rest,
        data,
    };
}
