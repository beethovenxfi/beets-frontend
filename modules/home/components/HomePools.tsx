import { Box, BoxProps, Flex, Image, Link } from '@chakra-ui/react';
import { PoolCard } from '~/components/pool-card/PoolCard';
import { BeetsHeadline } from '~/components/typography/BeetsHeadline';
import { BeetsSubHeadline } from '~/components/typography/BeetsSubHeadline';
import { PoolCardCarousel } from '~/components/carousel/PoolCardCarousel';
import BeetsButton from '~/components/button/Button';
import { useUserData } from '~/lib/user/useUserData';
import {
    useGetHomeFeaturedPoolsQuery,
    useGetPoolsLazyQuery,
    useGetPoolsQuery,
} from '~/apollo/generated/graphql-codegen-generated';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { useEffect } from 'react';
import { BeetsSkeleton } from '~/components/skeleton/BeetsSkeleton';
import { PoolCardUser } from '~/components/pool-card/PoolCardUser';
import { orderBy } from 'lodash';
import { NextLink } from '~/components/link/NextLink';

export function HomePools(props: BoxProps) {
    const {
        stakedValueUSD,
        portfolioValueUSD,
        loading: userDataLoading,
        userPoolIds,
        usdBalanceForPool,
        bptBalanceForPool,
    } = useUserData();
    const { data } = useGetHomeFeaturedPoolsQuery();
    const featuredPoolGroups = data?.featuredPoolGroups || [];
    const [getPools, getPoolsQuery] = useGetPoolsLazyQuery();
    const userPools = orderBy(getPoolsQuery.data?.poolGetPools || [], (pool) => usdBalanceForPool(pool.id), 'desc');
    const userPoolIdsStr = userPoolIds.join();

    useEffect(() => {
        getPools({
            variables: {
                where: { idIn: userPoolIds, poolTypeNotIn: ['LINEAR', 'LIQUIDITY_BOOTSTRAPPING', 'UNKNOWN'] },
            },
        });
    }, [userPoolIdsStr]);

    //minWidth = 0 is needed for a swiper nested in a flex layout
    return (
        <Box minWidth="0" {...props}>
            {(userPools.length > 0 || getPoolsQuery.loading) && (
                <>
                    <BeetsHeadline mb="10">My investments</BeetsHeadline>
                    <Box mb="10">
                        <Flex mb="4">
                            <BeetsSkeleton isLoaded={!getPoolsQuery.loading}>
                                <BeetsSubHeadline>
                                    {userPools.length === 1
                                        ? `${numberFormatUSDValue(portfolioValueUSD)} invested in 1 pool`
                                        : `${numberFormatUSDValue(portfolioValueUSD)} invested across ${
                                              userPools.length
                                          } pools`}
                                </BeetsSubHeadline>
                            </BeetsSkeleton>
                        </Flex>
                        <PoolCardCarousel
                            items={userPools.map((pool) => (
                                <PoolCardUser
                                    pool={pool}
                                    key={pool.id}
                                    balance={bptBalanceForPool(pool.id)}
                                    balanceUSD={usdBalanceForPool(pool.id)}
                                />
                            ))}
                            loading={getPoolsQuery.loading}
                            cardHeight="327px"
                        />
                    </Box>
                </>
            )}

            <BeetsHeadline mb="10">Featured pools</BeetsHeadline>
            {featuredPoolGroups.map((group) => (
                <Box mb="8" key={group.id}>
                    <Flex mb="4" alignItems="center">
                        <Image src={group.icon} alt={`${group.id}-icon`} width="24px" height="24px" />
                        <BeetsSubHeadline ml="2">{group.title}</BeetsSubHeadline>
                    </Flex>
                    <PoolCardCarousel
                        items={group.items.map((item) => {
                            switch (item.__typename) {
                                case 'GqlPoolMinimal':
                                    return <PoolCard pool={item} key={item.id} />;
                                case 'GqlFeaturePoolGroupItemExternalLink':
                                    return (
                                        <Flex
                                            alignItems="flex-end"
                                            justifyContent="center"
                                            height="216px"
                                            key={item.id}
                                            overflowY="hidden"
                                        >
                                            <Image
                                                src={item.image}
                                                width="full"
                                                position="absolute"
                                                top="0"
                                                left="0"
                                                bottom="0"
                                                right="0"
                                                height="216px"
                                                alt={`${item.id}-image`}
                                                objectFit={{ base: 'cover', sm: 'contain' }}
                                            />
                                            <BeetsButton
                                                as="a"
                                                href={item.buttonUrl}
                                                target="_blank"
                                                fontSize={{ base: '0.75rem', sm: '1rem' }}
                                            >
                                                {item.buttonText}
                                            </BeetsButton>
                                        </Flex>
                                    );
                            }
                        })}
                    />
                </Box>
            ))}
            {/*<Box mb="8">
                <Flex mb="4">
                    <NextImage src={PoolIcon1} />
                    <BeetsSubHeadline ml="2">New & popular</BeetsSubHeadline>
                </Flex>
                <PoolCardCarousel
                    items={[
                        <PoolCard key="1" />,
                        <PoolCard key="2" />,
                        <PoolCard key="3" />,
                        <PoolCard key="4" />,
                        <PoolCard key="5" />,
                        <PoolCard key="6" />,
                        <PoolCard key="7" />,
                        <PoolCard key="8" />,
                    ]}
                />
            </Box>
            <Box mb="8">
                <Flex mb="4">
                    <NextImage src={PoolIcon2} />
                    <BeetsSubHeadline ml="2">Index fund pools</BeetsSubHeadline>
                </Flex>
                <PoolCardCarousel
                    items={[<PoolCard key="1" />, <PoolCard key="2" />, <PoolCard key="3" />, <PoolCard key="4" />]}
                />
            </Box>
            <Box mb="8">
                <Flex mb="4">
                    <NextImage src={PoolIcon3} />
                    <BeetsSubHeadline ml="2">Boosted pools</BeetsSubHeadline>
                </Flex>
                <PoolCardCarousel
                    items={[
                        <PoolCard key="1" />,
                        <PoolCard key="2" />,
                        <Flex alignItems="flex-end" justifyContent="center" height="100%" key="3">
                            <Image
                                src="https://beethoven-assets.s3.eu-central-1.amazonaws.com/boosted-ludwig-min.png"
                                width="full"
                                position="absolute"
                                top="0"
                                left="0"
                                bottom="0"
                                right="0"
                            />
                            <BeetsButton onClick={() => {}}>What is a Boosted pool?</BeetsButton>
                        </Flex>,
                    ]}
                />
            </Box>
            <Box>
                <Flex mb="4">
                    <NextImage src={PoolIcon3} />
                    <BeetsSubHeadline ml="2">Stable pools</BeetsSubHeadline>
                </Flex>
                <PoolCardCarousel items={[<PoolCard key="1" />, <PoolCard key="2" />]} />
            </Box>*/}
        </Box>
    );
}
