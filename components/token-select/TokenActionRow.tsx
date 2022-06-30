import { memo } from 'react';
import { Button, ButtonProps } from '@chakra-ui/button';
import { motion } from 'framer-motion';
import { Box, Heading, HStack } from '@chakra-ui/layout';
import TokenAvatar from '~/components/token/TokenAvatar';
import { TokenBase } from '~/lib/services/token/token-types';
import BeetsButton from '~/components/button/Button';
import { LinkProps } from '@chakra-ui/react';

type TokenRowProps = TokenBase & {
    index: number;
    action: 'import' | 'remove';
};

export const TokenActionRow = memo(function TokenRow({
    symbol,
    address,
    index,
    onClick,
    action,
}: TokenRowProps & ButtonProps & LinkProps) {
    return (
        <Button
            animate={{ opacity: 1, transition: { delay: index * 0.01 } }}
            initial={{ opacity: 0 }}
            as={motion.button}
            width="full"
            height="fit-content"
            variant="unstyled"
        >
            <HStack width="full" paddingY="4" justifyContent="space-between">
                <HStack>
                    <TokenAvatar address={address} size="sm" />
                    <Heading size="md" fontWeight="semibold" color="gray.100">
                        {symbol}
                    </Heading>
                </HStack>
                <Box>
                    <BeetsButton onClick={onClick}>{action === 'import' ? 'Add' : 'Remove'}</BeetsButton>
                </Box>
            </HStack>
        </Button>
    );
});
