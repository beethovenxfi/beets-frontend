import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Heading,
    Text,
} from '@chakra-ui/react';
import PoolInvestForm from '~/modules/pool/invest/components/PoolInvestForm';
import { PoolInvestStakeForm } from '~/modules/pool/invest/components/PoolInvestStakeForm';
import { BeetsBoxHeader } from '~/components/box/BeetsBoxHeader';
import { BeetsBox } from '~/components/box/BeetsBox';

function PoolInvestActions() {
    return (
        <Accordion flex={1} mx={8} defaultIndex={0}>
            <AccordionItem border="none">
                <BeetsBoxHeader px={1} py={2} borderBottomWidth="1">
                    <AccordionButton>
                        <Box flex="1" textAlign="left" textStyle="h4">
                            1. Invest in pool
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </BeetsBoxHeader>
                <AccordionPanel p={0}>
                    <BeetsBox borderRadius={0} p={4} pb={6}>
                        <PoolInvestForm />
                    </BeetsBox>
                </AccordionPanel>
            </AccordionItem>

            <AccordionItem border="none">
                <BeetsBoxHeader px={1} py={2} borderRadius={0} borderBottomLeftRadius="md" borderBottomRightRadius="md">
                    <AccordionButton>
                        <Box flex="1" textAlign="left" textStyle="h4">
                            2. Stake in Farm
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </BeetsBoxHeader>
                <AccordionPanel pb={4}>
                    <PoolInvestStakeForm />
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
}

export default PoolInvestActions;
