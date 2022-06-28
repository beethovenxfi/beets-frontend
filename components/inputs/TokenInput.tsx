import { Box, Button, Text, VStack } from '@chakra-ui/react';
import { useGetTokens } from '~/lib/global/useToken';
import TokenAvatar from '../token/TokenAvatar';
import BeetsInput from './BeetsInput';
import { tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import { useUserTokenBalances } from '~/lib/user/useUserTokenBalances';
import { useUserAccount } from '~/lib/user/useUserAccount';
import PresetSelector from './PresetSelector';
import { KeyboardEvent } from 'react';

type Props = {
    label?: string;
    toggleTokenSelect?: () => void;
    address: string | null;
    onChange?: (event: { currentTarget: { value: string } }) => void;
    value?: string | null;
    showBalance?: boolean;
    showPresets?: boolean;
};

export default function TokenInput({
    label,
    toggleTokenSelect,
    address,
    onChange,
    value,
    showBalance = true,
    showPresets,
}: Props) {
    const { getToken } = useGetTokens();
    const { userAddress, isConnected } = useUserAccount();
    const { userBalances, isLoading } = useUserTokenBalances();
    const userBalance = address ? tokenGetAmountForAddress(address, userBalances) : '0';

    const token = getToken(address || '');
    const decimalPlaces = token ? token.decimals : 18;

    const handleOnChange = (event: { currentTarget: { value: string } }) => {
        let newValue = event.currentTarget.value;

        if (newValue.includes('.')) {
            const [leftDigits, rightDigits] = newValue.split('.');

            if (rightDigits && rightDigits.length > decimalPlaces) {
                const maxLength = leftDigits.length + decimalPlaces + 1;
                newValue = newValue.slice(0, maxLength);
            }
        }
        onChange && onChange({ currentTarget: { value: newValue } });
    };

    const handlePresetSelected = (preset: number) => {
        handleOnChange({ currentTarget: { value: (parseFloat(userBalance) * preset).toString() } });
    };

    function blockInvalidCharacters(event: KeyboardEvent<HTMLInputElement>): void {
        ['e', 'E', '+', '-'].includes(event.key) && event.preventDefault();
    }

    return (
        <VStack width="full" alignItems="flex-start">
            <Box position="relative" width="full">
                <BeetsInput
                    min={0}
                    value={value || ''}
                    onChange={handleOnChange}
                    placeholder="0"
                    type="number"
                    label={label}
                    onKeyDown={blockInvalidCharacters}
                />
                <Box position="absolute" zIndex="toast" right=".75rem" top="50%" transform="translateY(-50%)">
                    <Button
                        onClick={toggleTokenSelect}
                        backgroundColor="beets.lightAlpha.200"
                        _hover={{ backgroundColor: 'beets.green', color: 'gray.500' }}
                        px="2"
                    >
                        <TokenAvatar size="xs" address={address || ''} />
                        <Text paddingLeft="2">{token?.symbol} </Text>
                    </Button>
                </Box>
            </Box>
            {showPresets && <PresetSelector onPresetSelected={handlePresetSelected} />}
        </VStack>
    );
}
