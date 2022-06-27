import { Box, Flex, HStack, Image, Text } from '@chakra-ui/react';
import PoolIcon1 from '~/assets/icons/pool-icon-1.svg';
import PoolIcon2 from '~/assets/icons/pool-icon-2.svg';
import PoolIcon3 from '~/assets/icons/pool-icon-3.svg';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import TokenAvatarSet from '~/components/token/TokenAvatarSet';
import NextImage from 'next/image';

interface Props {
    image?: string;
}

export function PoolCard({ image }: Props) {
    return (
        <Box bgColor="box.500" borderRadius="md">
            {image ? (
                <Image src={image} height="160px" width="full" borderTopLeftRadius="md" borderTopRightRadius="md" />
            ) : null}
            <Box p="4" pb="8">
                <Box fontSize="xl" pr="12" pb="6">
                    <Text noOfLines={2}>All you need is a really long pool name</Text>
                </Box>
                <HStack pb="6" spacing="2">
                    <Box>
                        <NextImage src={PoolIcon1} />
                    </Box>
                    <Box>
                        <NextImage src={PoolIcon2} />
                    </Box>
                    <Box>
                        <NextImage src={PoolIcon3} />
                    </Box>
                </HStack>
                <Flex>
                    <Text fontSize="3xl" lineHeight="30px">
                        123.23%
                    </Text>
                    <AprTooltip
                        onlySparkles={true}
                        textProps={{ fontSize: '2xl' }}
                        data={{
                            __typename: 'GqlPoolApr',
                            total: '1.2323',
                            items: [
                                { title: 'Swap APR', apr: '0.22', __typename: 'GqlBalancePoolAprItem' },
                                { title: 'BEETS reward APR', apr: '0.22', __typename: 'GqlBalancePoolAprItem' },
                            ],
                            hasRewardApr: false,
                            nativeRewardApr: '',
                            swapApr: '0',
                            thirdPartyApr: '0',
                        }}
                    />
                </Flex>
                <Text color="gray.200" pb="8">
                    0.33% Daily
                </Text>
                <TokenAvatarSet
                    addresses={[
                        '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
                        '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
                        '0xf24bcf4d1e507740041c9cfd2dddb29585adce1e',
                    ]}
                    width={140}
                    imageSize={40}
                />
            </Box>
        </Box>
    );
}
