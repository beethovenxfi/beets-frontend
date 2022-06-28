import { Box, Button, Link, Skeleton, Text, VStack, HStack } from '@chakra-ui/react';
import { FormEvent } from 'react';
import { useGetTokens } from '~/lib/global/useToken';
import TokenAvatar from '../token/TokenAvatar';
import BeetsInput from './BeetsInput';
import { tokenFormatAmountPrecise, tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { useUserTokenBalances } from '~/lib/user/useUserTokenBalances';
import { useUserAccount } from '~/lib/user/useUserAccount';
import PresetSelector from './PresetSelector';
import { ChevronDown } from 'react-feather';
import numeral from 'numeral';

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
    const { getToken, priceForAmount } = useGetTokens();
    const { userAddress, isConnected } = useUserAccount();
    const { userBalances, isLoading } = useUserTokenBalances();

    const userBalance = address ? tokenGetAmountForAddress(address, userBalances) : '0';
    const estimatedTokenPrice = priceForAmount({ amount: value || '0', address: address || '' });

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
                    textAlign="right"
                    wrapperProps={{ height: '125px' }}
                    headingProps={{ marginTop: '2', fontSize: '.85rem' }}
                    paddingBottom="5"
                />
                <Box position="absolute" zIndex="toast" left=".75rem" top="50%" transform="translateY(-50%)">
                    <VStack spacing="none">
                        <Button
                            height="fit-content"
                            paddingY="1"
                            onClick={toggleTokenSelect}
                            backgroundColor="transparent"
                            _hover={{ backgroundColor: 'beets.green', color: 'gray.500' }}
                            paddingX="1"
                        >
                            <HStack spacing="none">
                                <TokenAvatar size="xs" address={address || ''} />
                                <Text fontSize="1.15rem" paddingLeft="2">
                                    {getToken(address || '')?.symbol || ''}
                                </Text>
                                <Box marginLeft="1">
                                    <ChevronDown size={16} />
                                </Box>
                            </HStack>
                        </Button>
                    </VStack>
                </Box>
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
                    You have {numeral(userBalance).format('0,0.00a')}
                </Text>
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
                    ~{numeral(estimatedTokenPrice).format('0,0.000a')}
                </Text>
            </Box>
            {showPresets && <PresetSelector onPresetSelected={handlePresetSelected} />}
        </VStack>
    );
}
