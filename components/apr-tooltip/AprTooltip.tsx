// @ts-nocheck

import { GqlPoolApr } from '~/apollo/generated/graphql-codegen-generated';
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, Box, Flex, Text, TextProps } from '@chakra-ui/react';
import StarsIcon from '~/components/apr-tooltip/StarsIcon';
import numeral from 'numeral';
import { BeetsBox } from '~/components/box/BeetsBox';
import { AprText } from '~/components/apr-tooltip/AprText';

interface Props {
    data: GqlPoolApr;
    textProps?: TextProps;
}

function AprTooltip({ data, textProps }: Props) {
    const color = 'beets.gray.200';
    const formatApr = (apr: number) => numeral(apr).format('0.00%');
    return (
        <Popover trigger="hover">
            <Flex justify={'end'} align={'center'}>
                <Text fontWeight={'semibold'} mr={1} {...textProps}>
                    {formatApr(data.total)}
                </Text>
                <PopoverTrigger>
                    <a>
                        <StarsIcon />
                    </a>
                </PopoverTrigger>
            </Flex>

            <PopoverContent w="fit-content" bg="black">
                <PopoverHeader bgColor="rgba(255,255,255,0.05)">
                    <Text color={color}>Total APR</Text>
                    {formatApr(data.total)}
                </PopoverHeader>
                <BeetsBox p="2" fontSize="sm">
                    {data.items.map((item, index) => {
                        return (
                            <Box key={index}>
                                <Flex>
                                    {formatApr(item.apr)} <AprText>{item.title}</AprText>
                                </Flex>
                                {item.subItems?.map((subItem, subItemIndex) => (
                                    <Flex align={'center'} key={subItemIndex}>
                                        <Box
                                            w="1px"
                                            bgColor={color}
                                            m="0.25rem"
                                            h={subItemIndex === 0 ? '1rem' : '2rem'}
                                            mt={subItemIndex === 0 ? '-0.3rem' : '-1.7rem'}
                                        />
                                        <Box h="1px" w="0.75rem" bgColor={color} mr="0.25rem" ml="-0.25rem" />
                                        <Flex grow>
                                            {formatApr(subItem.apr)} <AprText>{subItem.title}</AprText>
                                        </Flex>
                                    </Flex>
                                ))}
                            </Box>
                        );
                    })}
                </BeetsBox>
            </PopoverContent>
        </Popover>
    );
}

export default AprTooltip;
