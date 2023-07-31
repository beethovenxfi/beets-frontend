import { Box, Button, HStack, useBreakpointValue, useDisclosure, VStack } from '@chakra-ui/react';
import { PoolStakeModal } from '~/modules/pool/stake/PoolStakeModal';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { usePool } from '~/modules/pool/lib/usePool';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { useEffect } from 'react';
import { useInvestState } from '~/modules/pool/invest/lib/useInvestState';

export function PoolStakeInFarmWarning() {
    const { pool } = usePool();
    const { userWalletBptBalance, hasBptInWallet } = usePoolUserBptBalance();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const valueInWallet =
        (parseFloat(userWalletBptBalance) / parseFloat(pool.dynamicData.totalShares)) *
        parseFloat(pool.dynamicData.totalLiquidity);

    const { showToast, removeToast } = useToast();
    const isMobile = useBreakpointValue({ base: true, lg: false });

    const { isPoolInInvestState } = useInvestState();

    const StackComponent = isMobile ? VStack : HStack;

    useEffect(() => {
        // also don't show toast while investing
        if (hasBptInWallet && !isPoolInInvestState) {
            showToast({
                id: 'stake-alert',
                type: ToastType.Warn,
                content: (
                    <StackComponent>
                        <Box>
                            You have ~{numberFormatUSDValue(valueInWallet)} worth of BPT in your wallet. This pool
                            offers additional rewards that will accumulate over time when your BPT are staked.
                        </Box>
                        <Button variant="outline" colorScheme="black" onClick={onOpen}>
                            Stake now
                        </Button>
                    </StackComponent>
                ),
            });
        } else {
            removeToast('stake-alert');
        }
    }, [hasBptInWallet, isPoolInInvestState]);

    return <PoolStakeModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />;
}
