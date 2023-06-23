import { useRouter } from 'next/router';
import {
    GetLgeQuery,
    GetLgeQueryVariables,
    GetPoolQuery,
    GetPoolQueryVariables,
    GqlLge,
    GqlPoolUnion,
} from '~/apollo/generated/graphql-codegen-generated';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetLge, GetPool } from '~/apollo/generated/operations';
import Head from 'next/head';
import { FallbackPlaceholder } from '~/components/fallback/FallbackPlaceholder';
import { Lge } from '~/modules/lge/detail/Lge';
import { LgeProvider } from '~/modules/lge/lib/useLge';
import { PoolProvider } from '~/modules/pool/lib/usePool';
import { UserLgeTokenBalancesProvider } from '~/modules/lge/lib/useUserLgeTokenBalances';
import { UserTokenBalancesProvider } from '~/lib/user/useUserTokenBalances';
import Compose, { ProviderWithProps } from '~/components/providers/Compose';

interface Props {
    lge: GqlLge;
    pool: GqlPoolUnion;
}

const LgePage = ({ lge, pool }: Props) => {
    const router = useRouter();
    if (router.isFallback) {
        return <FallbackPlaceholder />;
    }

    const LgeProviders: ProviderWithProps[] = [
        [LgeProvider, { lge }],
        [PoolProvider, { pool }],
        [UserTokenBalancesProvider, {}],
        [UserLgeTokenBalancesProvider, {}],
    ];

    return (
        <>
            <Head>
                <title>Beethoven X | {lge.name} LBP</title>
                <meta name="title" content={`Beethoven X | ${lge.name} LBP`} />
                <meta property="og:title" content={`Beethoven X | ${lge.name} LBP`} />
                <meta property="twitter:title" content={`Beethoven X | ${lge.name} LBP`} />
            </Head>
            <Compose providers={LgeProviders}>
                <Lge />
            </Compose>
        </>
    );
};

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true,
    };
}

export async function getStaticProps({ params }: { params: { lgeId: string } }) {
    const client = initializeApolloClient();
    const { data: lge } = await client.query<GetLgeQuery, GetLgeQueryVariables>({
        query: GetLge,
        variables: { id: params.lgeId },
    });

    const { data: pool } = await client.query<GetPoolQuery, GetPoolQueryVariables>({
        query: GetPool,
        variables: { id: params.lgeId },
    });

    return loadApolloState({
        client,
        props: { lge: lge.lge, pool: pool.pool },
    });
}

export default LgePage;
