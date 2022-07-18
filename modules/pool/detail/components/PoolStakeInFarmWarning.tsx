import { Alert, AlertIcon, Box, Button, Link, useDisclosure } from '@chakra-ui/react';
import { PoolInvestStakeModal } from '~/modules/pool/stake/PoolInvestStakeModal';

export function PoolStakeInFarmWarning() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Alert status="warning" borderRadius="md" mb="4">
            <AlertIcon />
            <Box flex="1" mr="2">
                This pool offers additional rewards that will accumulate over time when your BPT are staked.{' '}
                <Link color="beets.cyan">More details</Link>
            </Box>
            <Button variant="outline" onClick={onOpen}>
                Stake now
            </Button>
            <PoolInvestStakeModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        </Alert>
    );
}
