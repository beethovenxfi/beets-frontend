import { Box, HStack, Text, VStack } from '@chakra-ui/layout';
import React from 'react';
import Card from '~/components/card/Card';

interface Props {}

export default function RelicMaturity({}: Props) {
    return (
        <Card p="4" width="full">
            <VStack spacing="8">
                <HStack width="full" spacing="12" alignItems="flex-start">
                    <VStack spacing="0" alignItems="flex-start">
                        <Text lineHeight="1rem" fontWeight="semibold" fontSize="sm" color="beets.base.50">
                            Projected Maturity
                        </Text>
                    </VStack>
                </HStack>
            </VStack>
        </Card>
    );
}
