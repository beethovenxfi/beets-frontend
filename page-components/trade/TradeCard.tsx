import { Box, Button, useTheme, VStack } from '@chakra-ui/react';
import TokenInput from '../../components/inputs/TokenInput';
import { ChevronsDown } from 'react-feather';
import TokenSelect from '../../components/token-select/TokenSelect';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Card from '../../components/card/Card';
import { useGetSwaps } from '~/page-components/trade/tradeState';

function TradeCard() {
    const { tradeState, loadSwaps, loadingSwaps, error, networkStatus } = useGetSwaps();

    const [showTokenSelect, setShowTokenSelect] = useState(false);

    const toggleTokenSelect = () => {
        setShowTokenSelect(!showTokenSelect);
    };

    const theme = useTheme();
    return (
        <Card title="Market Swap" position="relative" overflow="hidden" height="md" shadow="lg">
            <VStack spacing="2" padding="4" width="full">
                <Box position="relative" width="full" onClick={toggleTokenSelect}>
                    <TokenInput />
                    <Button
                        justifyContent="center"
                        backgroundColor="beets.gray.600"
                        alignItems="center"
                        rounded="full"
                        border="4px"
                        padding="1"
                        borderColor="beets.gray.400"
                        position="absolute"
                        bottom="-20px"
                        left="calc(50% - 20px)"
                        zIndex="2"
                        role="group"
                        _hover={{ borderColor: 'beets.green.500', cursor: 'pointer' }}
                        _active={{ backgroundColor: 'beets.gray.600' }}
                    >
                        <Box
                            marginTop="1px"
                            color="beets.gray.200"
                            css={{
                                transform: 'rotate(360deg)',
                                transition: 'transform linear .15s',
                            }}
                            _groupHover={{
                                color: 'beets.green.500',
                                cursor: 'pointer',
                                transform: 'rotate(180deg)',
                                transition: 'all linear .15s',
                            }}
                            _groupFocus={{ color: 'beets.green.500', cursor: 'pointer' }}
                        >
                            <ChevronsDown size={24} color="currentColor" />
                        </Box>
                    </Button>
                </Box>
                <TokenInput />
            </VStack>
            <AnimatePresence>{showTokenSelect && <TokenSelect />}</AnimatePresence>
        </Card>
    );
}
export default TradeCard;
