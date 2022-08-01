import { Button } from '@chakra-ui/button';
import { Box } from '@chakra-ui/layout';
import { Spinner } from '@chakra-ui/react';
import { AnimatePresence, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { ChevronsDown, RefreshCcw } from 'react-feather';
import { AnimatedBox } from '~/components/animation/chakra';

type Props = {
    isLoading?: boolean;
    onClick: () => void;
};
export function TradeCardRefreshButton({ isLoading, onClick }: Props) {
    return (
        <Button
            justifyContent="center"
            backgroundColor="gray.600"
            alignItems="center"
            rounded="full"
            border="4px"
            padding="1"
            borderColor="gray.500"
            zIndex="2"
            role="group"
            _hover={{ borderColor: 'beets.green', cursor: 'pointer' }}
            _active={{ backgroundColor: 'gray.600' }}
            _focus={{ outline: 'none' }}
            onClick={onClick}
        >
            <AnimatePresence>
                <Box
                    marginTop="1px"
                    color="gray.200"
                    css={{
                        transform: 'rotate(360deg)',
                        transition: 'transform linear .15s',
                    }}
                    _groupHover={{
                        color: 'beets.green',
                        cursor: 'pointer',
                        transform: 'rotate(180deg)',
                        transition: 'all linear .15s',
                    }}
                    _groupFocus={{ color: 'beets.green', cursor: 'pointer' }}
                >
                    {!isLoading && (
                        <AnimatedBox
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <RefreshCcw size={20} color="currentColor" />
                        </AnimatedBox>
                    )}
                    {isLoading && (
                        <AnimatedBox
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Spinner color="beets.highlight" size="sm" marginBottom="1px" />
                        </AnimatedBox>
                    )}
                </Box>
            </AnimatePresence>
        </Button>
    );
}
