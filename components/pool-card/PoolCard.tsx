import { Box, BoxProps, Flex, FlexProps, HStack, Image, Text } from '@chakra-ui/react';
import PoolIcon1 from '~/assets/icons/pool-icon-1.svg';
import PoolIcon2 from '~/assets/icons/pool-icon-2.svg';
import PoolIcon3 from '~/assets/icons/pool-icon-3.svg';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import TokenAvatarSet from '~/components/token/TokenAvatarSet';
import NextImage from 'next/image';

interface Props extends BoxProps {}

export function PoolCard({ ...rest }: Props) {
    return (
        <Box flex="1" {...rest}>
            <Flex bgColor="beets.base.600" borderRadius="md" p="4" flexDirection="column">
                <Box fontSize="lg" pb="6">
                    <Text noOfLines={2}>All you need is a really long pool name</Text>
                </Box>
                <TokenAvatarSet
                    addresses={[
                        '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
                        '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
                        '0xf24bcf4d1e507740041c9cfd2dddb29585adce1e',
                    ]}
                    width={140}
                    imageSize={32}
                />
                <Box flex="1" pt="6">
                    <AprTooltip
                        textProps={{ fontSize: '2xl', fontWeight: 'normal', mr: '0', lineHeight: '26px' }}
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
                    <Text color="gray.200">0.33% Daily</Text>
                </Box>
            </Flex>
        </Box>
    );
}
