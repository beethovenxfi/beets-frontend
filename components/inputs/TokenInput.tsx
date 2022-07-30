import { Box, Button, Text, VStack, HStack, Tooltip } from '@chakra-ui/react';
import { useGetTokens } from '~/lib/global/useToken';
import TokenAvatar from '../token/TokenAvatar';
import BeetsInput from './BeetsInput';
import { tokenFormatAmountPrecise, tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import { useUserTokenBalances } from '~/lib/user/useUserTokenBalances';
import { useUserAccount } from '~/lib/user/useUserAccount';
import PresetSelector from './PresetSelector';
import { ChevronDown, Lock } from 'react-feather';
import numeral from 'numeral';
import { KeyboardEvent } from 'react';
import { tokenInputBlockInvalidCharacters, tokenInputTruncateDecimalPlaces } from '~/lib/util/input-util';
import { numberFormatLargeUsdValue } from '~/lib/util/number-formats';

type Props = {
    label?: string;
    toggleTokenSelect?: () => void;
    address: string | null;
    onChange?: (event: { currentTarget: { value: string } }) => void;
    value?: string | null;
    showBalance?: boolean;
    showPresets?: boolean;
    requiresApproval?: boolean;
};

export default function TokenInput({
    label,
    toggleTokenSelect,
    address,
    onChange,
    value,
    requiresApproval,
    showBalance = true,
    showPresets,
}: Props) {
    const { getToken, priceForAmount } = useGetTokens();
    const { userAddress, isConnected } = useUserAccount();
    const { userBalances, isLoading } = useUserTokenBalances();

    const userBalance = address ? tokenGetAmountForAddress(address, userBalances) : '0';
    const estimatedTokenPrice = priceForAmount({ amount: value || '0', address: address || '' });

    const token = getToken(address || '');
    const decimalPlaces = token ? token.decimals : 18;

    const handleOnChange = (event: { currentTarget: { value: string } }) => {
        const newValue = tokenInputTruncateDecimalPlaces(event.currentTarget.value, decimalPlaces);

        onChange && onChange({ currentTarget: { value: newValue } });
    };

    const handlePresetSelected = (preset: number) => {
        handleOnChange({ currentTarget: { value: (parseFloat(userBalance) * preset).toString() } });
    };

    return (
        <VStack width="full" alignItems="flex-start">
            <Box position="relative" width="full">
                <BeetsInput
                    min={0}
                    value={value || ''}
                    onChange={handleOnChange}
                    onKeyDown={tokenInputBlockInvalidCharacters}
                    placeholder="0"
                    type="number"
                    label={label}
                    textAlign="right"
                    wrapperProps={{ height: '125px' }}
                    headingProps={{ marginTop: '2', fontSize: '.85rem' }}
                    paddingBottom="5"
                >
                    {requiresApproval && (
                        <Box position="absolute" color="orange" top=".5rem" right=".75rem" mt="1">
                            <Tooltip
                                label={`Before swapping, you'll need to give the Beethoven X vault contract permission to move ${token?.symbol} on your behalf.`}
                                hasArrow
                            >
                                <Lock size={16} />
                            </Tooltip>
                        </Box>
                    )}
                </BeetsInput>
                <Box position="absolute" left=".75rem" top="50%" transform="translateY(-50%)">
                    <VStack spacing="none">
                        <Button
                            height="fit-content"
                            paddingY="1"
                            onClick={toggleTokenSelect}
                            backgroundColor="transparent"
                            _hover={{ backgroundColor: 'beets.green', color: 'gray.500' }}
                            paddingX="1"
                            _focus={{ boxShadow: 'none' }}
                        >
                            <HStack spacing="none">
                                <TokenAvatar size="xs" address={address || ''} />
                                <Text fontSize="1.15rem" paddingLeft="2">
                                    {token?.symbol}
                                </Text>
                                <Box marginLeft="1">
                                    <ChevronDown size={16} />
                                </Box>
                            </HStack>
                        </Button>
                    </VStack>
                </Box>
                {!isLoading && isConnected && (
                    <Text
                        position="absolute"
                        zIndex="dropdown"
                        bottom=".75rem"
                        left=".75rem"
                        fontWeight="normal"
                        color="gray.200"
                        size="xs"
                        fontSize=".85rem"
                    >
                        Balance: {tokenFormatAmountPrecise(userBalance, 4)}
                    </Text>
                )}
                {estimatedTokenPrice > 0 && (
                    <Text
                        position="absolute"
                        zIndex="dropdown"
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
            {showPresets && <PresetSelector onPresetSelected={handlePresetSelected} />}
        </VStack>
    );
}
