import { Alert, AlertIcon, Box, Button, Link, useDisclosure } from '@chakra-ui/react';
import { PoolStakeModal } from '~/modules/pool/stake/PoolStakeModal';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { usePool } from '~/modules/pool/lib/usePool';
import { numberFormatUSDValue } from '~/lib/util/number-formats';

export function PoolStakeInFarmWarning() {
    const { pool } = usePool();
    const { userWalletBptBalance, hasBptInWallet } = usePoolUserBptBalance();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const valueInWallet =
        (parseFloat(userWalletBptBalance) / parseFloat(pool.dynamicData.totalShares)) *
        parseFloat(pool.dynamicData.totalLiquidity);

    return (
        <>
            {hasBptInWallet && (
                <Alert status="warning" borderRadius="md" mb="4">
                    <AlertIcon />
                    <Box flex="1" mr="8">
                        You have {numberFormatUSDValue(valueInWallet)} worth of BPT in your wallet. This pool offers
                        additional rewards that will accumulate over time when your BPT are staked.{' '}
                        <Link color="beets.cyan">More details</Link>
                    </Box>
                    <Button variant="outline" onClick={onOpen}>
                        Stake now
                    </Button>
                </Alert>
            )}
            <PoolStakeModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        </>
    );
}
