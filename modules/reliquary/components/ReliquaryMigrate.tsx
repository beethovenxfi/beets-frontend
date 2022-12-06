import { VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';

interface Props {}

export default function ReliquaryMigrate(props: Props) {
    useEffect(() => {
        // setBptInput(parseFloat(depositableBalance).toFixed(4));
    }, []);
    return (
        <VStack spacing="4">
            {/* <HStack pl="4" spacing="4" backgroundColor="whiteAlpha.200" rounded="md">
                                                <Text>{parseFloat(depositableBalance).toFixed(4)} BPT Available</Text>
                                                <Button onClick={setMaxBpt}>Use max</Button>
                                            </HStack> */}
            {/* </Box> */}
            {/* TODO MOVE BELOW INPUT TO A MIGRATE fBEETS/BPT UI */}
            {/* <Input
                                                value={bptInput}
                                                _active={{
                                                    outline: 'none !important',
                                                    backgroundColor: 'blackAlpha.400',
                                                    boxShadow: 'none',
                                                }}
                                                _focus={{
                                                    outline: 'none !important',
                                                    backgroundColor: 'blackAlpha.400',
                                                    boxShadow: 'none',
                                                }}
                                                backgroundColor="blackAlpha.400"
                                                boxShadow="none"
                                                border="none"
                                                fontSize="4rem"
                                                height="100px"
                                                textAlign="center"
                                                color="orange.400"
                                                fontWeight="semibold"
                                                onChange={updateBptInput}
                                                px="4"
                                                as={motion.input}
                                                animate={inputAnimation}
                                            /> */}
        </VStack>
    );
}
