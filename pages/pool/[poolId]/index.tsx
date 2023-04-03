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
import { PoolComposableUserPoolTokenBalanceProvider } from '~/modules/pool/lib/usePoolComposableUserPoolTokenBalances';
import { RelicDepositBalanceProvider } from '~/modules/reliquary/lib/useRelicDepositBalance';
import { networkConfig } from '~/lib/config/network-config';
import { ReliquaryPool } from '~/modules/reliquary/detail/ReliquaryPool';
import Compose, { ProviderWithProps } from '~/components/providers/Compose';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

interface Props {
    pool: GqlPoolUnion;
}

const PoolPage = ({ pool }: Props) => {
    const { appName } = useNetworkConfig();

    const router = useRouter();
    if (router.isFallback) {
        return <FallbackPlaceholder />;
    }

    const TITLE = `${appName} | ${pool.name}`;
    const isReliquaryPool = pool.id === networkConfig.reliquary.fbeets.poolId;

    const PoolProviders: ProviderWithProps[] = [
        [PoolProvider, { pool }],
        [PoolUserBptBalanceProvider, {}],
        [PoolUserDepositBalanceProvider, {}],
        [PoolUserInvestedTokenBalanceProvider, {}],
        [PoolUserPendingRewardsProvider, {}],
        [PoolUserTokenBalancesInWalletProvider, {}],
        [PoolComposableUserPoolTokenBalanceProvider, {}],
    ];

    return (
        <>
            <Head>
                <title>{TITLE}</title>
                <meta name="title" content={TITLE} />
                <meta property="og:title" content={TITLE} />
                <meta property="twitter:title" content={TITLE} />
            </Head>
            <Compose providers={PoolProviders}>
                {isReliquaryPool ? (
                    <RelicDepositBalanceProvider>
                        <ReliquaryPool />
                    </RelicDepositBalanceProvider>
                ) : (
                    <Pool />
                )}
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

export async function getStaticProps({ params }: { params: { poolId: string } }) {
    const client = initializeApolloClient();
    const { data } = await client.query<GetPoolQuery, GetPoolQueryVariables>({
        query: GetPool,
        variables: { id: params.poolId },
    });

    return loadApolloState({
        client,
        props: { pool: data.pool },
    });
}

export default PoolPage;
