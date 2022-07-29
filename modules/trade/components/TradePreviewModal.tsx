import { useRef, useState } from 'react';
import { useBatchSwap } from '~/modules/trade/lib/useBatchSwap';
import {
    BeetsModalBody,
    BeetsModalContent,
    BeetsModalHeader,
    BeetsModalHeadline,
    BeetsModalSubHeadline,
} from '~/components/modal/BeetsModal';
import { TradePreviewContent } from '~/modules/trade/components/TradePreviewContent';
import { Alert, AlertIcon, Box, Button, Link, Modal, ModalOverlay, Spinner } from '@chakra-ui/react';
import { ModalCloseButton } from '@chakra-ui/modal';
import { AnimateSharedLayout, motion, AnimatePresence } from 'framer-motion';
import { BeetsBox } from '~/components/box/BeetsBox';
import { BatchSwapSorRoute } from '~/components/batch-swap/BatchSwapSorRoute';
import { useTrade } from '~/modules/trade/lib/useTrade';
import { CardRow } from '~/components/card/CardRow';
import { addressShortDisplayName } from '~/lib/util/address';
import {
    etherscanGetAddressUrl,
    etherscanGetBlockUrl,
    etherscanGetTxUrl,
    etherscanTxShortenForDisplay,
} from '~/lib/util/etherscan';
import { format } from 'date-fns';
import { TradeSubmittedContent } from '~/modules/trade/components/TradeSubmittedContent';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function TradePreviewModal({ isOpen, onClose }: Props) {
    const batchSwapQuery = useBatchSwap();
    const initialRef = useRef(null);
    const [submitting, setSubmitting] = useState(false);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="xl"
            initialFocusRef={initialRef}
            onCloseComplete={() => {
                batchSwapQuery.reset();
                setSubmitting(false);
            }}
        >
            <ModalOverlay />
            <BeetsModalContent>
                <ModalCloseButton />
                <BeetsModalHeader>
                    <BeetsModalHeadline>{!submitting ? 'Review swap' : 'Transaction details'}</BeetsModalHeadline>
                    {!submitting && (
                        <BeetsModalSubHeadline>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu leo vestibulum
                        </BeetsModalSubHeadline>
                    )}
                </BeetsModalHeader>
                <BeetsModalBody>
                    {!submitting && (
                        <TradePreviewContent
                            query={batchSwapQuery}
                            onTransactionSubmitted={() => setSubmitting(true)}
                        />
                    )}
                    {submitting && (
                        <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }}>
                            <TradeSubmittedContent query={batchSwapQuery} />
                        </motion.div>
                    )}
                    {batchSwapQuery.isConfirmed && (
                        <div className="fireworks">
                            <div className="before" />
                            <div className="after" />
                        </div>
                    )}
                </BeetsModalBody>
            </BeetsModalContent>
        </Modal>
    );
}
