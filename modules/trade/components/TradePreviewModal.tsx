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
import { Modal, ModalOverlay } from '@chakra-ui/react';
import { ModalCloseButton } from '@chakra-ui/modal';
import { motion } from 'framer-motion';
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
                    <BeetsModalHeadline>{!submitting ? 'Review swap' : 'Swap transaction details'}</BeetsModalHeadline>
                    {/*!submitting && (
                        <BeetsModalSubHeadline>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu leo vestibulum
                        </BeetsModalSubHeadline>
                    )*/}
                </BeetsModalHeader>
                <BeetsModalBody>
                    {batchSwapQuery.isConfirmed && (
                        <div className="fireworks">
                            <div className="before" />
                            <div className="after" />
                        </div>
                    )}
                    {!submitting && (
                        <TradePreviewContent
                            query={batchSwapQuery}
                            onTransactionSubmitted={() => setSubmitting(true)}
                        />
                    )}
                    {submitting && (
                        <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
                            <TradeSubmittedContent query={batchSwapQuery} />
                        </motion.div>
                    )}
                </BeetsModalBody>
            </BeetsModalContent>
        </Modal>
    );
}
