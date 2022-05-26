// @ts-nocheck

import { GqlPoolApr } from '~/apollo/generated/graphql-codegen-generated';
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, Box, Flex, Text, TextProps } from '@chakra-ui/react';
import StarsIcon from '~/components/apr-tooltip/StarsIcon';
import numeral from 'numeral';
import { BeetsBox } from '~/components/box/BeetsBox';

interface Props {
    data: GqlPoolApr;
    textProps?: TextProps;
}

function AprTooltip({ data, textProps }: Props) {
    return (
        <Popover trigger="hover">
            <Flex justify={'end'} align={'center'}>
                <Text fontWeight={'semibold'} mr={1} {...textProps}>
                    {numeral(data.total).format('0.00%')}
                </Text>
                <PopoverTrigger>
                    <a>
                        <StarsIcon />
                    </a>
                </PopoverTrigger>
            </Flex>

            <PopoverContent w="fit-content" bg="black">
                <PopoverHeader bgColor="rgba(255,255,255,0.05)">
                    <Text color="beets.gray.200">Total APR</Text>
                    {numeral(data.total).format('0.00%')}
                </PopoverHeader>
                <BeetsBox p="2" fontSize="sm">
                    {data.items.map((item, index) => {
                        return (
                            <Box key={index}>
                                <Flex>
                                    {numeral(item.apr).format('0.00%')}{' '}
                                    <Text px="1" color="beets.gray.200">
                                        {item.title}
                                    </Text>
                                </Flex>
                                {item.subItems?.map((subItem, subItemIndex) => (
                                    <Flex align={'center'} className="tw-pl-1 tw-pt-1" key={subItemIndex}>
                                        <Box
                                            className={`tw-w-px tw-bg-gray-700 -tw-mr-px ${
                                                subItemIndex === 0 ? 'tw-h-4 -tw-mt-4' : 'tw-h-8 -tw-mt-8'
                                            }`}
                                        />
                                        <Box className="tw-h-px tw-w-3 tw-bg-gray-700 tw-mr-2" />
                                        <Flex grow>
                                            {numeral(subItem.apr).format('0.00%')}{' '}
                                            <Text px="1" color="beets.gray.200">
                                                {subItem.title}
                                            </Text>
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
