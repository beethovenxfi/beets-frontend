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
import { Box, Modal, ModalOverlay, Portal, Text } from '@chakra-ui/react';
import { ModalCloseButton } from '@chakra-ui/modal';
import { motion } from 'framer-motion';
import { TradeSubmittedContent } from '~/modules/trade/components/TradeSubmittedContent';
import { GqlLge } from '~/apollo/generated/graphql-codegen-generated';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    lge?: GqlLge;
}

export function TradePreviewModal({ isOpen, onClose, lge }: Props) {
    const batchSwapQuery = useBatchSwap();
    const initialRef = useRef(null);
    const [submitting, setSubmitting] = useState(false);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="lg"
            initialFocusRef={initialRef}
            onCloseComplete={() => {
                batchSwapQuery.reset();
                setSubmitting(false);
            }}
        >
            <ModalOverlay bg="blackAlpha.900" />
            <BeetsModalContent>
                <ModalCloseButton />
                <BeetsModalHeader>
                    <BeetsModalHeadline>{!submitting ? 'Review swap' : 'Swap transaction details'}</BeetsModalHeadline>
                </BeetsModalHeader>
                <BeetsModalBody p="0">
                    {batchSwapQuery.isConfirmed && (
                        <Portal>
                            <Box position="absolute" top="0" left="0" width="full">
                                <div className="fireworks">
                                    <div className="before" />
                                    <div className="after" />
                                </div>
                            </Box>
                        </Portal>
                    )}
                    {!submitting && (
                        <TradePreviewContent
                            query={batchSwapQuery}
                            onTransactionSubmitted={() => setSubmitting(true)}
                            lge={lge}
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
