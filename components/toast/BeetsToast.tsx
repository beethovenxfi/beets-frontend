import { Box } from '@chakra-ui/layout';
import { Portal } from '@chakra-ui/portal';
import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactNode, useCallback, useContext, useEffect, useState } from 'react';

interface Props {
    children: ReactNode | ReactNode[];
}

interface BeetsToastContextType {
    showToast: (id: string, content: ReactNode | ReactNode[], toastType?: string) => void;
}

interface Toast {
    id: string;
    toastText: ReactNode | ReactNode[];
}

export const BeetsToastContext = React.createContext({} as BeetsToastContextType);

export const useToast = () => useContext(BeetsToastContext);

export default function BeetsToast({ children }: Props) {
    const [toastList, setToastList] = useState<Toast[]>([]);

    const showToast = useCallback(
        (id: string, toastText: ReactNode | ReactNode[], toastType?: string) => {
            setToastList([
                ...toastList,
                {
                    id,
                    toastText,
                },
            ]);
        },
        [toastList],
    );

    return (
        <BeetsToastContext.Provider value={{ showToast }}>
            <Portal>
                <AnimatePresence>
                    {toastList.map((toastList, i) => (
                        <Box
                            key={`toastItem-${i}`}
                            bg="beets.base.900"
                            position="fixed"
                            p="4"
                            left="0"
                            right="0"
                            bottom="-128px"
                            marginX="auto"
                            width="fit-content"
                            rounded="lg"
                            shadow="dark-lg"
                            as={motion.div}
                            initial={{}}
                            animate={{ transform: `translateY(-${148 + i * 64}px)` }}
                            exit={{ transform: 'translateY(0px)' }}
                        >
                            {toastList.toastText}
                        </Box>
                    ))}
                </AnimatePresence>
            </Portal>
            {children}
        </BeetsToastContext.Provider>
    );
}
