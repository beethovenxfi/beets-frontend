import { Box, useDisclosure } from '@chakra-ui/react';
import { PoolCreateTokenSelectModal } from './token-select/PoolCreateTokenSelectModal';
import { usePoolCreate } from '../../lib/usePoolCreate';
import { Plus } from 'react-feather';

export function PoolCreateTokens() {
    const tokenSelectDisclosure = useDisclosure();

    const { tokensSelected } = usePoolCreate();

    return (
        <>
            <Box>{tokensSelected.length === 0 ? 'No tokens selected' : tokensSelected}</Box>
            <Box>
                <Plus onClick={() => tokenSelectDisclosure.onOpen()} />
            </Box>
            <PoolCreateTokenSelectModal
                isOpen={tokenSelectDisclosure.isOpen}
                onOpen={tokenSelectDisclosure.onOpen}
                onClose={tokenSelectDisclosure.onClose}
            />
        </>
    );
}
