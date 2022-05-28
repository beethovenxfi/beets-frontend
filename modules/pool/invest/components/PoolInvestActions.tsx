import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react';
import PoolInvestForm from '~/modules/pool/invest/components/PoolInvestForm';
import { PoolInvestStakeForm } from '~/modules/pool/invest/components/PoolInvestStakeForm';
import { BeetsBoxHeader } from '~/components/box/BeetsBoxHeader';
import { BeetsBox } from '~/components/box/BeetsBox';
import { usePoolUserPoolTokenBalances } from '~/modules/pool/lib/usePoolUserPoolTokenBalances';

function PoolInvestActions() {
    const { hasBptInWallet } = usePoolUserPoolTokenBalances();

    return (
        <Accordion flex={1} mx={8} defaultIndex={hasBptInWallet ? 1 : 0}>
            <AccordionItem border="none">
                <AccordionButton p={0}>
                    <BeetsBoxHeader px={4} py={4} flex={1} borderRadius={0}>
                        <Box flex="1" textAlign="left" textStyle="h4">
                            1. Invest in pool
                        </Box>
                        <AccordionIcon />
                    </BeetsBoxHeader>
                </AccordionButton>
                <AccordionPanel p={0}>
                    <BeetsBox borderRadius={0} px={4} py={6}>
                        <PoolInvestForm />
                    </BeetsBox>
                </AccordionPanel>
            </AccordionItem>

            <AccordionItem border="none" isDisabled={!hasBptInWallet}>
                <AccordionButton p={0}>
                    <BeetsBoxHeader
                        px={4}
                        py={4}
                        borderRadius={0}
                        borderTopWidth={1}
                        borderTopColor="beets.gray.300"
                        flex={1}
                    >
                        <Box flex="1" textAlign="left" textStyle="h4">
                            2. Deposit BPT in Farm
                        </Box>
                        <AccordionIcon />
                    </BeetsBoxHeader>
                </AccordionButton>
                <AccordionPanel p={0} pb={4}>
                    <BeetsBox borderRadius={0} px={4} py={6}>
                        <PoolInvestStakeForm />
                    </BeetsBox>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
}

export default PoolInvestActions;
