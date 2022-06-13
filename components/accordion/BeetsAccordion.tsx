import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    BoxProps,
} from '@chakra-ui/react';
import { BeetsBoxHeader } from '~/components/box/BeetsBoxHeader';
import { ReactNode } from 'react';

interface Props extends BoxProps {
    defaultIndex?: number;
    items: {
        headline: ReactNode;
        content: ReactNode;
        disabled?: boolean;
    }[];
}

export function BeetsAccordion({ items, defaultIndex, ...rest }: Props) {
    if (items.length === 1) {
        return (
            <Box {...rest}>
                <BeetsBoxHeader px="4" py="4" flex="1">
                    <Box flex="1" textAlign="left" textStyle="h4">
                        {items[0].headline}
                    </Box>
                </BeetsBoxHeader>
                <Box px="4" py="6" bg="beets.lightAlpha.300">
                    {items[0].content}
                </Box>
            </Box>
        );
    }

    return (
        <Box {...rest}>
            <Accordion defaultIndex={defaultIndex}>
                {items.map((item, index) => (
                    <AccordionItem border="none" key={index} isDisabled={item.disabled}>
                        {({ isExpanded }) => (
                            <>
                                <AccordionButton p="0">
                                    <BeetsBoxHeader
                                        px="4"
                                        py="4"
                                        flex="1"
                                        borderTopLeftRadius={index === 0 ? 'md' : 'none'}
                                        borderTopRightRadius={index === 0 ? 'md' : 'none'}
                                        borderBottomRightRadius={
                                            index === items.length - 1 && !isExpanded ? 'md' : 'none'
                                        }
                                        borderBottomLeftRadius={
                                            index === items.length - 1 && !isExpanded ? 'md' : 'none'
                                        }
                                        borderTopWidth={index !== 0 ? 1 : 0}
                                        borderTopColor="gray.300"
                                    >
                                        <Box flex="1" textAlign="left" textStyle="h4">
                                            {index + 1}. {item.headline}
                                        </Box>
                                        <AccordionIcon />
                                    </BeetsBoxHeader>
                                </AccordionButton>
                                <AccordionPanel p="0">
                                    <Box px="4" py="6" bg="beets.lightAlpha.300">
                                        {item.content}
                                    </Box>
                                </AccordionPanel>
                            </>
                        )}
                    </AccordionItem>
                ))}
            </Accordion>
        </Box>
    );
}
