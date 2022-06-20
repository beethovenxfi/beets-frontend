import { Box, Button, Link, Skeleton, Text, VStack } from '@chakra-ui/react';
import { FormEvent } from 'react';
import { useGetTokens } from '~/lib/global/useToken';
import TokenAvatar from '../token/TokenAvatar';
import BeetsInput from './BeetsInput';
import { tokenFormatAmountPrecise, tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { useUserTokenBalances } from '~/lib/global/useUserTokenBalances';
import { useUserAccount } from '~/lib/global/useUserAccount';
import PresetSelector from './PresetSelector';

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

    const handlePresetSelected = (preset: number) => {
        onChange && onChange({ currentTarget: { value: (parseFloat(userBalance) * preset).toString() } });
    };

    return (
        <VStack width="full" alignItems="flex-start">
            <Box position="relative" width="full">
                <BeetsInput
                    min={0}
                    value={value || ''}
                    onChange={onChange}
                    placeholder="0"
                    type="number"
                    label={label}
                ></BeetsInput>
                <Box position="absolute" zIndex="toast" right=".75rem" top="50%" transform="translateY(-50%)">
                    <Button
                        onClick={toggleTokenSelect}
                        backgroundColor="beets.lightAlpha.200"
                        _hover={{ backgroundColor: 'beets.green', color: 'gray.500' }}
                        px="2"
                    >
                        <TokenAvatar size="xs" address={address || ''} />
                        <Text paddingLeft="2">{getToken(address || '')?.symbol || ''} </Text>
                    </Button>
                </Box>
            </Box>
            {showPresets && <PresetSelector onPresetSelected={handlePresetSelected} />}
        </VStack>
    );
}
