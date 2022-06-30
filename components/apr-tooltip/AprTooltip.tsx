// @ts-nocheck

import { GqlPoolApr } from '~/apollo/generated/graphql-codegen-generated';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    Box,
    Flex,
    Text,
    TextProps,
    HStack,
    Button,
    PlacementWithLogical,
} from '@chakra-ui/react';
import StarsIcon from '~/components/apr-tooltip/StarsIcon';
import numeral from 'numeral';
import { BeetsBox } from '~/components/box/BeetsBox';
import { AprText } from '~/components/apr-tooltip/AprText';

interface Props {
    data: GqlPoolApr;
    textProps?: TextProps;
    onlySparkles?: boolean;
    placement?: PlacementWithLogical;
    aprLabel?: boolean;
}

function AprTooltip({ data, textProps, onlySparkles, placement, aprLabel }: Props) {
    const formatApr = (apr: number) => {
        if (apr < 0.0000001) {
            return '0.00%';
        }

        return numeral(apr).format('0.00%');
    };

    return (
        <Popover trigger="hover" placement={placement}>
            <HStack align="center">
                {!onlySparkles && (
                    <Text fontSize="1rem" fontWeight="semibold" mr="1" {...textProps}>
                        {formatApr(data.total)}
                        {aprLabel ? ' APR' : ''}
                    </Text>
                )}
                <PopoverTrigger>
                    <Button height="auto" variant="unstyled" _active={{ outline: 'none' }} _focus={{ outline: 'none' }}>
                        <StarsIcon />
                    </Button>
                </PopoverTrigger>
            </HStack>

            <PopoverContent w="fit-content" bgColor="beets.base.800" shadow="2xl">
                <PopoverHeader bgColor="whiteAlpha.100">
                    <Text>Total APR</Text>
                    <Text fontSize="1.5rem">{formatApr(data.total)}</Text>
                </PopoverHeader>
                <Box p="2" fontSize="sm" bgColor="whiteAlpha.200">
                    {data.items.map((item, index) => {
                        return (
                            <Box key={index}>
                                <Flex>
                                    {formatApr(item.apr)} <AprText>{item.title}</AprText>
                                </Flex>
                                {item.subItems?.map((subItem, subItemIndex) => (
                                    <Flex align="center" key={subItemIndex}>
                                        <Box
                                            w="1px"
                                            m="0.25rem"
                                            h={subItemIndex === 0 ? '1rem' : '2rem'}
                                            mt={subItemIndex === 0 ? '-0.3rem' : '-1.7rem'}
                                        />
                                        <Box h="1px" w="0.75rem" mr="0.25rem" ml="-0.25rem" />
                                        <Flex grow>
                                            {formatApr(subItem.apr)} <AprText>{subItem.title}</AprText>
                                        </Flex>
                                    </Flex>
                                ))}
                            </Box>
                        );
                    })}
                </Box>
            </PopoverContent>
        </Popover>
    );
}

export default AprTooltip;
