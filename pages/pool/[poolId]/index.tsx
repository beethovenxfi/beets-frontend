import { useRouter } from 'next/router';
import { GetPoolQuery, GetPoolQueryVariables, GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetPool } from '~/apollo/generated/operations';
import { Pool } from '~/modules/pool/detail/Pool';
import { PoolProvider } from '~/modules/pool/lib/usePool';
import Head from 'next/head';
import { FallbackPlaceholder } from '~/components/fallback/FallbackPlaceholder';
import { PoolUserBptBalanceProvider } from '~/modules/pool/lib/usePoolUserBptBalance';
import { PoolUserDepositBalanceProvider } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { PoolUserInvestedTokenBalanceProvider } from '~/modules/pool/lib/usePoolUserInvestedTokenBalances';
import { PoolUserPendingRewardsProvider } from '~/modules/pool/lib/usePoolUserPendingRewards';
import { PoolUserTokenBalancesInWalletProvider } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';

interface Props {
    pool: GqlPoolUnion;
}

const PoolPage = ({ pool }: Props) => {
    const router = useRouter();
    if (router.isFallback) {
        return <FallbackPlaceholder />;
    }

    return (
        <>
            <Head>
                <title>Beethoven X | {pool.name}</title>
                <meta name="title" content={`Beethoven X | ${pool.name}`} />
                <meta name="description" content="A nice pool to get started with..." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://beets.fi/" />
                <meta property="og:title" content={`Beethoven X | ${pool.name}`} />
                <meta property="og:description" content="A nice pool to get started with..." />
                <meta
                    property="og:image"
                    content={`https://beets-frontend-git-feature-og-poc-beethovenx.vercel.app/images/${pool.id}.png`}
                />
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://app.beets.fi/" />
                <meta property="twitter:title" content={`Beethoven X | ${pool.name}`} />
                <meta property="twitter:description" content="A nice pool to get started with..." />
                <meta
                    property="twitter:image"
                    content={`https://beets-frontend-git-feature-og-poc-beethovenx.vercel.app/images/${pool.id}.png`}
                />
            </Head>
            <PoolProvider pool={pool}>
                <PoolUserBptBalanceProvider>
                    <PoolUserDepositBalanceProvider>
                        <PoolUserInvestedTokenBalanceProvider>
                            <PoolUserPendingRewardsProvider>
                                <PoolUserTokenBalancesInWalletProvider>
                                    <Pool />
                                </PoolUserTokenBalancesInWalletProvider>
                            </PoolUserPendingRewardsProvider>
                        </PoolUserInvestedTokenBalanceProvider>
                    </PoolUserDepositBalanceProvider>
                </PoolUserBptBalanceProvider>
            </PoolProvider>
        </>
    );
};

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true,
    };
}

export async function getStaticProps({ params }: { params: { poolId: string } }) {
    const client = initializeApolloClient();
    const { data } = await client.query<GetPoolQuery, GetPoolQueryVariables>({
        query: GetPool,
        variables: { id: params.poolId },
    });

    //pre-load the fbeets ratio for fidelio duetto
    /*if (params.poolId === networkConfig.fbeets.poolId) {
        await client.query({ query: GetFbeetsRatio });
    }*/

    return loadApolloState({
        client,
        props: { pool: data.pool },
    });
}

export default PoolPage;
