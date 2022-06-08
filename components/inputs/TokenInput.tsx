import { Flex, Input, Button, Box, Heading, VStack, Text, Link } from '@chakra-ui/react';
import { FormEvent, ReactNode } from 'react';
import { useGetTokens } from '~/lib/global/useToken';
import TokenAvatar from '../token/TokenAvatar';
import BeetsInput from './BeetsInput';

type Props = {
    label?: string;
    below?: ReactNode;
    toggleTokenSelect?: () => void;
    address: string | null;
    onChange?: (event: FormEvent<HTMLInputElement>) => void;
    value?: string | null;
};

export default function TokenInput({ label, below, toggleTokenSelect, address, onChange, value }: Props) {
    const { getToken } = useGetTokens();
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
                    below={below}
                />
                <Box position="absolute" zIndex="toast" right=".75rem" top="50%" transform="translateY(-50%)">
                    <Button
                        onClick={toggleTokenSelect}
                        backgroundColor="beets.base.light.alpha.200"
                        _hover={{ backgroundColor: 'beets.green.400', color: 'beets.gray.500' }}
                        px="2"
                    >
                        <TokenAvatar size="xs" address={address || ''} />
                        <Text paddingLeft="2">{getToken(address || '')?.symbol || ''} </Text>
                    </Button>
                </Box>
            </Box>
        </VStack>
    );
}
