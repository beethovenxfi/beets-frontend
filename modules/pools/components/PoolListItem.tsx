import { GqlPoolMinimalFragment } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Flex, Text, HStack, VStack, Grid, GridItem, SimpleGrid } from '@chakra-ui/react';
import TokenAvatarSet from '~/components/token/TokenAvatarSet';
import Link from 'next/link';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { BoxProps } from '@chakra-ui/layout';
import Image from 'next/image';
import PoolIcon1 from '~/assets/icons/pool-icon-1.svg';
import PoolIcon2 from '~/assets/icons/pool-icon-2.svg';

interface Props extends BoxProps {
    pool: GqlPoolMinimalFragment;
}

export default function PoolListItem({ pool, ...rest }: Props) {
    const gridData = [
        { label: 'APR', value: <AprTooltip data={pool.dynamicData.apr} textProps={{ fontWeight: 'normal' }} /> },
        { label: 'TVL', value: numeral(pool.dynamicData.totalLiquidity).format('$0,0.00a') },
        { label: 'VOLUME (24H)', value: numeral(pool.dynamicData.volume24h).format('$0,0') },
        { label: 'FEES (24H)', value: numeral(pool.dynamicData.volume24h).format('$0,0') },
    ];
    return (
        <Box {...rest}>
            <Box
                bgColor="beets.base.700"
                border="0px"
                display={{ base: 'block', md: 'none' }}
                my={4}
                p={4}
                borderRadius="xl"
                boxShadow="xl"
            >
                <Grid textAlign="left" templateColumns="1fr  25px" gap={4}>
                    <GridItem alignSelf="center">
                        <Link href={`/pool/${pool.id}`} passHref>
                            <a>
                                <Text color="white" fontSize="md" fontWeight="bold" lineHeight="1rem">
                                    {pool.name}
                                </Text>
                            </a>
                        </Link>
                    </GridItem>
                    <GridItem>
                        <Image src={PoolIcon1} alt="pool icon" />
                    </GridItem>
                    <GridItem>
                        <SimpleGrid columns={[2, 4]} spacing={3}>
                            {gridData.map((data, index) => (
                                <VStack key={index} spacing="0" alignItems="flex-start">
                                    <Text fontSize="0.6em">{data.label}</Text>
                                    <Text fontSize="sm" fontWeight="medium">
                                        {data.value}
                                    </Text>
                                </VStack>
                            ))}
                        </SimpleGrid>
                    </GridItem>
                    <GridItem>
                        <Image src={PoolIcon2} alt="pool icon" />
                    </GridItem>
                    <GridItem>
                        <TokenAvatarSet
                            imageSize={25}
                            width={92}
                            addresses={pool.allTokens
                                .filter((token) => !token.isNested && !token.isPhantomBpt)
                                .map((token) => token.address)}
                        />
                    </GridItem>
                </Grid>
            </Box>
            <Box display={{ base: 'none', md: 'block' }}>
                <Link href={`/pool/${pool.id}`} passHref>
                    <a>
                        <Flex
                            px="4"
                            py="4"
                            cursor="pointer"
                            alignItems={'center'}
                            fontSize="lg"
                            _hover={{ bg: '#100C3A' }}
                            borderBottomColor="beets.base.800"
                            borderBottomWidth={1}
                            bg="box.500"
                        >
                            <Box w={90} textAlign={'center'}>
                                <TokenAvatarSet
                                    imageSize={25}
                                    width={92}
                                    addresses={pool.allTokens
                                        .filter((token) => !token.isNested && !token.isPhantomBpt)
                                        .map((token) => token.address)}
                                />
                            </Box>
                            <Flex flex={1}>
                                <Text fontSize="md">{pool.name}</Text>
                            </Flex>
                            <Box w={200} textAlign="right">
                                <Text fontSize="md">{numeral(pool.dynamicData.totalLiquidity).format('$0,0')}</Text>
                            </Box>
                            <Box w={200} textAlign="right">
                                <Text fontSize="md">{numeral(pool.dynamicData.volume24h).format('$0,0')}</Text>
                            </Box>
                            <Box w={200}>
                                <AprTooltip data={pool.dynamicData.apr} textProps={{ fontWeight: 'normal' }} />
                            </Box>
                        </Flex>
                    </a>
                </Link>
            </Box>
        </Box>
    );
}
