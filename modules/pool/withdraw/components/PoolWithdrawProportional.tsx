import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Flex, Heading, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from '@chakra-ui/react';
import numeral from 'numeral';
import TokenAvatar from '~/components/token-avatar/TokenAvatar';
import { BoxProps } from '@chakra-ui/layout';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { usePool } from '~/modules/pool/lib/usePool';
import { useWithdrawProportionalAmounts } from '~/modules/pool/withdraw/lib/useWithdrawProportionalAmounts';
import { useGetTokens } from '~/lib/global/useToken';

interface Props extends BoxProps {}

export function PoolWithdrawProportional({ ...rest }: Props) {
    const { pool } = usePool();
    const { setProportionalPercent, proportionalPercent } = useWithdrawState();
    const { proportionalAmounts } = useWithdrawProportionalAmounts();
    const { priceFor } = useGetTokens();

    const withdrawOptions = pool.withdrawConfig.options;

    return (
        <Box {...rest}>
            <Box mb={2}>
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
                    const proportionalAmount =
                        proportionalAmounts.find((tokenAmount) => tokenAmount.address === poolToken.address)?.amount ||
                        '0';

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
                                    {proportionalAmount}
                                </Heading>
                                <Text textAlign="right" color="gray.500">
                                    {numeral(parseFloat(proportionalAmount) * priceFor(tokenOption.address)).format(
                                        '$0,0.00',
                                    )}
                                </Text>
                            </Box>
                        </Flex>
                    );
                })}
            </Box>
        </Box>
    );
}
