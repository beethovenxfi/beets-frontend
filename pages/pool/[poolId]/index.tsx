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
import { GetServerSideProps } from 'next';

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
                <meta property="og:title" content={`Beethoven X | ${pool.name}`} />
                <meta property="twitter:title" content={`Beethoven X | ${pool.name}`} />
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


export const getServerSideProps: GetServerSideProps<any, {poolId: string}> = async ({res, params } ) => {
    // we cache for 15 sec and return a stale version while refetching for maximum 1 minute
    // see https://nextjs.org/docs/going-to-production#caching
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=15, stale-while-revalidate=59'
    )
    const client = initializeApolloClient();
    const { data } = await client.query<GetPoolQuery, GetPoolQueryVariables>({
        query: GetPool,
        variables: { id: params!.poolId },
    });


    return {
        props: {
           pool: data.pool
        }
    }
}

export default PoolPage;
