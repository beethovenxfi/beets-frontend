import { memo } from 'react';
import { Button, ButtonProps } from '@chakra-ui/button';
import { motion } from 'framer-motion';
import { Box, Heading, HStack } from '@chakra-ui/layout';
import TokenAvatar from '~/components/token/TokenAvatar';
import { TokenBase } from '~/lib/services/token/token-types';
import BeetsButton from '~/components/button/Button';

type TokenRowProps = TokenBase & {
    index: number;
};

export const TokenImportRow = memo(function TokenRow({ symbol, address, index, onClick }: TokenRowProps & ButtonProps) {
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
                    <Heading size="md" fontWeight="semibold" color="beets.gray.100">
                        {symbol}
                    </Heading>
                </HStack>
                <Box>
                    <BeetsButton onClick={onClick}>Add</BeetsButton>
                </Box>
            </HStack>
        </Button>
    );
});
