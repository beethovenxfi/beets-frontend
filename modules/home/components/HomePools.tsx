import { Box, BoxProps, Button, Flex, Image, Skeleton } from '@chakra-ui/react';
import { PoolCard } from '~/components/pool-card/PoolCard';
import { BeetsHeadline } from '~/components/typography/BeetsHeadline';
import { BeetsSubHeadline } from '~/components/typography/BeetsSubHeadline';
import { PoolCardCarousel } from '~/components/carousel/PoolCardCarousel';

import { useUserData } from '~/lib/user/useUserData';
import { useGetHomeFeaturedPoolsQuery, useGetPoolsLazyQuery } from '~/apollo/generated/graphql-codegen-generated';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { useEffect } from 'react';

import { PoolCardUser } from '~/components/pool-card/PoolCardUser';
import { orderBy } from 'lodash';

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
                            <Skeleton isLoaded={!getPoolsQuery.loading}>
                                <BeetsSubHeadline>
                                    {userPools.length === 1
                                        ? `${numberFormatUSDValue(portfolioValueUSD)} invested in 1 pool`
                                        : `${numberFormatUSDValue(portfolioValueUSD)} invested across ${
                                              userPools.length
                                          } pools`}
                                </BeetsSubHeadline>
                            </Skeleton>
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
                                            <Button
                                                variant="primary"
                                                as="a"
                                                href={item.buttonUrl}
                                                target="_blank"
                                                size="md"
                                                _hover={{ transform: 'none', bgColor: 'beets.highlight' }}
                                            >
                                                {item.buttonText}
                                            </Button>
                                        </Flex>
                                    );
                            }
                        })}
                    />
                </Box>
            ))}
        </Box>
    );
}
