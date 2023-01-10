import { Button, HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import numeral from 'numeral';
import Card from '~/components/card/Card';
import TokenAvatar from '~/components/token/TokenAvatar';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { useRelicDepositBalance } from '../lib/useRelicDepositBalance';

export default function RelicLiquidity() {
    const { data: relicTokenBalances, relicBalanceUSD } = useRelicDepositBalance();

    return (
        <Card px="2" py="4" h="full">
            <VStack spacing="0" alignItems="flex-start" h="full">
                <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                    Relic liquidity
                </Text>
                <Text color="white" fontSize="1.75rem">
                    {numberFormatUSDValue(relicBalanceUSD)}
                </Text>
                <HStack spacing="1" mb="0.5" key="1">
                    <TokenAvatar h="20px" w="20px" address="0xf24bcf4d1e507740041c9cfd2dddb29585adce1e" />
                    <Text fontSize="1rem" lineHeight="1rem">
                        {numeral(242123).format('0,0')} BEETS
                    </Text>
                </HStack>
                <HStack spacing="1" mb="0.5" key="1">
                    <TokenAvatar h="20px" w="20px" address="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" />
                    <Text fontSize="1rem" lineHeight="1rem">
                        {numeral(42123).format('0,0')} FTM
                    </Text>
                </HStack>
                <Spacer />
                <HStack w="full">
                    <Button w="full" variant="primary">
                        Invest
                    </Button>
                    <Button w="full" variant="secondary">
                        Withdraw
                    </Button>
                </HStack>
            </VStack>
        </Card>
    );
}
