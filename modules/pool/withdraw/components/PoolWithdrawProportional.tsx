import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Flex, Heading, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from '@chakra-ui/react';
import numeral from 'numeral';
import TokenAvatar from '~/components/token-avatar/TokenAvatar';
import { useGetTokens } from '~/lib/global/useToken';
import { BoxProps } from '@chakra-ui/layout';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';

interface Props extends BoxProps {
    pool: GqlPoolUnion;
    proportionalPercent: number;
    setProportionalPercent: (value: number) => void;
}

export function PoolWithdrawProportional({ pool, setProportionalPercent, proportionalPercent, ...rest }: Props) {
    const { priceFor } = useGetTokens();
    const withdrawOptions = pool.withdrawConfig.options;

    return (
        <Box {...rest}>
            <Box>
                <Flex>
                    <Text flex={1} color="gray.500">
                        Proportional withdraw
                    </Text>
                    <Text color="gray.500">{proportionalPercent}%</Text>
                </Flex>
                <Slider
                    aria-label="proportional-withdraw-slider"
                    defaultValue={100}
                    onChange={setProportionalPercent}
                    value={proportionalPercent}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb />
                </Slider>
            </Box>
            <Box bgColor="gray.800" borderRadius="md">
                {withdrawOptions.map((option, index) => {
                    const tokenOption = option.tokenOptions[0];
                    const poolToken = pool.tokens[option.poolTokenIndex];
                    const last = index === withdrawOptions.length - 1;

                    return (
                        <Flex key={index} py={4} px={4} borderBottomWidth={last ? 0 : 1} borderBottomColor="gray.700">
                            <Flex flex={1} pr={4} alignItems="center">
                                <TokenAvatar address={tokenOption.address} size="sm" mr={2} />
                                <Heading fontSize="xl" fontWeight="medium">
                                    {tokenOption.symbol}{' '}
                                    {poolToken.weight ? numeral(poolToken.weight).format('%') : null}
                                </Heading>
                            </Flex>
                            <Box>
                                <Heading fontSize="xl" fontWeight="medium">
                                    1.234
                                </Heading>
                                <Text textAlign="right" color="gray.500">
                                    $1.20
                                </Text>
                            </Box>
                        </Flex>
                    );
                })}
            </Box>
        </Box>
    );
}
