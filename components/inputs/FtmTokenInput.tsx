import { forwardRef, Box, Text, VStack, HStack, Skeleton } from '@chakra-ui/react';
import { useGetTokens } from '~/lib/global/useToken';
import TokenAvatar from '../token/TokenAvatar';
import { BeetsInput } from './BeetsInput';
import { tokenFormatAmountPrecise, tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import { useUserTokenBalances } from '~/lib/user/useUserTokenBalances';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { tokenInputBlockInvalidCharacters, tokenInputTruncateDecimalPlaces } from '~/lib/util/input-util';
import { numberFormatLargeUsdValue } from '~/lib/util/number-formats';
import { oldBnumScaleAmount } from '~/lib/services/pool/lib/old-big-number';
import { formatFixed } from '@ethersproject/bignumber';
import PresetSelector from './PresetSelector';

type Props = {
    label: string;
    address: string;
    onChange?: (value: string) => void;
    value?: string | null;
    showBalance?: boolean;
    placeholder?: string;
    leaveSomeGas?: boolean;
};

export const FtmTokenInput = forwardRef(
    ({ label, address, onChange, value, placeholder, leaveSomeGas = false }: Props, ref) => {
        const { getToken, priceForAmount } = useGetTokens();
        const { isConnected } = useUserAccount();
        const { userBalances, isLoading } = useUserTokenBalances();

        const userBalance = tokenGetAmountForAddress(address, userBalances);
        const estimatedTokenPrice = priceForAmount({ amount: value || '0', address: address });

        const token = getToken(address);
        const decimalPlaces = token ? token.decimals : 18;

        const handleOnChange = (event: { currentTarget: { value: string } }) => {
            const newValue = tokenInputTruncateDecimalPlaces(event.currentTarget.value, decimalPlaces);

            onChange && onChange(newValue);
        };

        const handlePresetSelected = (preset: number) => {
            const reduceFtmAmountFactor = preset === 1 && leaveSomeGas ? 0.95 : 1;
            const scaledAmount = oldBnumScaleAmount(userBalance, token?.decimals)
                .times(preset)
                .times(reduceFtmAmountFactor)
                .toFixed(0);

            handleOnChange({ currentTarget: { value: formatFixed(scaledAmount, token?.decimals) } });
        };

        return (
            <VStack width="full" alignItems="flex-start" pb="2">
                <Box position="relative" width="full">
                    <BeetsInput
                        ref={ref}
                        min={0}
                        value={value || ''}
                        onChange={handleOnChange}
                        onKeyDown={tokenInputBlockInvalidCharacters}
                        placeholder={placeholder || '0'}
                        type="number"
                        label={label}
                        textAlign="right"
                        wrapperProps={{ height: '125px' }}
                        headingProps={{ marginTop: '2', fontSize: '.85rem' }}
                        paddingBottom="5"
                    ></BeetsInput>
                    <Box position="absolute" left=".75rem" top="50%" transform="translateY(-50%)" zIndex="2">
                        <HStack spacing="none">
                            <TokenAvatar size="xs" address={address} />
                            <Text fontSize="lg" paddingLeft="2">
                                {token?.address && token.symbol && token?.symbol}
                            </Text>
                        </HStack>
                    </Box>
                    {isConnected && (
                        <HStack
                            position="absolute"
                            bottom=".75rem"
                            left=".75rem"
                            fontWeight="normal"
                            color="gray.200"
                            fontSize=".85rem"
                            spacing="1"
                        >
                            <Text>Balance:</Text>
                            {isLoading ? (
                                <Skeleton width="52px" height="16px" />
                            ) : (
                                <Text>{tokenFormatAmountPrecise(userBalance, 4)}</Text>
                            )}
                        </HStack>
                    )}

                    {estimatedTokenPrice > 0 && (
                        <Text
                            position="absolute"
                            bottom=".75rem"
                            right=".75rem"
                            fontWeight="normal"
                            color="gray.200"
                            size="xs"
                            fontSize=".85rem"
                        >
                            ~{numberFormatLargeUsdValue(estimatedTokenPrice)}
                        </Text>
                    )}
                </Box>
                <PresetSelector onPresetSelected={handlePresetSelected} />
            </VStack>
        );
    },
);
