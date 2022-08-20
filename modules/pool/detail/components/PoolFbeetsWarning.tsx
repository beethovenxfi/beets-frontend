import { Alert, AlertIcon, Box, Button, Flex, Link, useDisclosure } from '@chakra-ui/react';
import { PoolStakeModal } from '~/modules/pool/stake/PoolStakeModal';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { FadeInOutBox } from '~/components/animation/FadeInOutBox';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function PoolFbeetsWarning() {
    const { hasBpt } = usePoolUserBptBalance();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const networkConfig = useNetworkConfig();

    return (
        <>
            <FadeInOutBox isVisible={hasBpt} containerWidth="100%">
                <Alert status="warning" borderRadius="md" mb="4" width="full">
                    <Flex width="full" alignItems="center">
                        <AlertIcon />
                        <Box flex="1" mr="8">
                            Your fBEETS position should be managed on the Stake page.
                        </Box>
                        <Button variant="outline" as={Link} href={networkConfig.stakeUrl}>
                            Go to Stake
                        </Button>
                    </Flex>
                </Alert>
            </FadeInOutBox>
            <PoolStakeModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        </>
    );
}
