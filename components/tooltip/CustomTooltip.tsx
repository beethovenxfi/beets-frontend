import {
    StackProps,
    Box,
    useBreakpointValue,
    Popover,
    HStack,
    PopoverContent,
    PopoverTrigger as OrigPopoverTrigger,
} from '@chakra-ui/react';

interface Props {
    trigger: React.ReactNode;
    content: React.ReactNode;
}

export function CustomTooltip({ trigger, content, ...rest }: Props & StackProps) {
    // temp fix: https://github.com/chakra-ui/chakra-ui/issues/5896#issuecomment-1104085557
    const PopoverTrigger: React.FC<{ children: React.ReactNode }> = OrigPopoverTrigger;
    const isMobile = useBreakpointValue({ base: true, lg: false });

    return (
        <Popover trigger="hover" placement={isMobile ? 'top' : 'right'}>
            <PopoverTrigger>
                <HStack
                    paddingX="3"
                    paddingY="2"
                    bg="whiteAlpha.200"
                    spacing="2"
                    fontSize="md"
                    rounded="full"
                    color="beets.base.50"
                    justifyContent="center"
                    fontWeight="semibold"
                    {...rest}
                >
                    {trigger}
                </HStack>
            </PopoverTrigger>
            <PopoverContent w="200px" bgColor="beets.base.800" shadow="2xl">
                <Box p="2" fontSize="sm" bgColor="whiteAlpha.200">
                    {content}
                </Box>
            </PopoverContent>
        </Popover>
    );
}
