import { Alert, AlertIcon, Box, Button, HStack, Link, useDisclosure } from '@chakra-ui/react';
import { PoolStakeModal } from '~/modules/pool/stake/PoolStakeModal';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { FadeInOutBox } from '~/components/animation/FadeInOutBox';
import { usePool } from '~/modules/pool/lib/usePool';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { useEffect } from 'react';

export function PoolStakeInFarmWarning() {
    const { pool } = usePool();
    const { userWalletBptBalance, hasBptInWallet } = usePoolUserBptBalance();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const valueInWallet =
        (parseFloat(userWalletBptBalance) / parseFloat(pool.dynamicData.totalShares)) *
        parseFloat(pool.dynamicData.totalLiquidity);

    const { showToast, updateToast, removeToast, toastList } = useToast();

    useEffect(() => {
        if (hasBptInWallet) {
            showToast({
                id: 'stake-alert',
                type: ToastType.Warn,
                content: (
                    <HStack>
                        <Box>
                            You have ~{numberFormatUSDValue(valueInWallet)} worth of BPT in your wallet. This pool
                            offers additional rewards that will accumulate over time when your BPT are staked.{' '}
                            {/*<Link color="beets.highlight">More details</Link>*/}
                        </Box>
                        <Button variant="outline" colorScheme="black" onClick={onOpen}>
                            Stake now
                        </Button>
                    </HStack>
                ),
            });
        }

        setTimeout(() => {
            updateToast('stake-alert', {
                type: ToastType.Success
            })
            // removeToast('stake-alert');
        }, 5000);
    }, [hasBptInWallet]);

    console.log('bingo', toastList);
    return (
        <>
            {/* <FadeInOutBox isVisible={hasBptInWallet} containerWidth="100%">
                <Alert status="warning" borderRadius="md" mb="4" width="full">
                    <AlertIcon />

                </Alert>
            </FadeInOutBox> */}
            <PoolStakeModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
        </>
    );
}
