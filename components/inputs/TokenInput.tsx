import { Flex, Input, Button, Box, Heading, VStack, Text } from '@chakra-ui/react';
import { useGetTokens } from '~/lib/global/useToken';
import TokenAvatar from '../token-avatar/TokenAvatar';
import BeetsInput from './BeetsInput';

type Props = {
    label?: string;
    toggleTokenSelect?: () => void;
    address: string | null;
};

export default function TokenInput({ label, toggleTokenSelect, address }: Props) {
    const { getToken } = useGetTokens();
    return (
        <VStack width="full" alignItems="flex-start">
            <Box position="relative" width="full">
                <BeetsInput placeholder="0" type="number" label={label} />
                <Box position="absolute" zIndex="toast" right=".75rem" top="50%" transform="translateY(-50%)">
                    <Button
                        onClick={toggleTokenSelect}
                        backgroundColor="beets.gray.300"
                        _hover={{ backgroundColor: 'beets.green.400', color: 'beets.gray.500' }}
                    >
                        <TokenAvatar size="xs" address={address || ''} />
                        <Text paddingLeft="2">{getToken(address || '')?.symbol || ''} </Text>
                    </Button>
                </Box>
            </Box>
        </VStack>
    );
}
