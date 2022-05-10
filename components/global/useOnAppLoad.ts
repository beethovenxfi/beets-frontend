import { useGetAppDataQuery, useGetTokensQuery } from '~/apollo/generated/graphql-codegen-generated';

export function useOnAppLoad() {
    const { loading } = useGetAppDataQuery();
}
