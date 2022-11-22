import { Box } from '@chakra-ui/layout';
import { Portal } from '@chakra-ui/portal';
import { CloseButton, HStack } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface Props {
    children: ReactNode | ReactNode[];
}

interface BeetsToastContextType {
    showToast: (toast: Toast) => void;
    removeToast: (id: string) => void;
    updateToast: (id: string, toast: Partial<Pick<Toast, 'content' | 'type' | 'auto'>>) => void;
    toastList: Toast[];
}

export enum ToastType {
    Info = 'INFO',
    Error = 'ERROR',
    Warn = 'WARN',
    Success = 'SUCCESS',
}

interface Toast {
    id: string;
    content: ReactNode | ReactNode[];
    auto?: boolean;
    type?: ToastType;
}

export const BeetsToastContext = React.createContext({} as BeetsToastContextType);

export const useToast = () => useContext(BeetsToastContext);

export default function BeetsToast({ children }: Props) {
    const [toastList, setToastList] = useState<Toast[]>([]);
    const toastListRef = useRef<Toast[]>([]);
    toastListRef.current = toastList;

    const showToast = (toast: Toast) => {
        if (toastListRef.current.find((_toast) => toast.id === _toast.id)) {
            return;
        }
        setToastList([
            ...toastList,
            {
                ...toast,
                type: toast.type || ToastType.Info,
            },
        ]);

        if (toast.auto) {
            setTimeout(() => {
                removeToast(toast.id);
            }, 3000);
        }
    };

    function removeToast(id: string) {
        console.log('remove', toastList);
        if (!toastListRef.current.length) return;
        setToastList(toastListRef.current.filter((toast) => toast.id !== id));
    }

    const updateToast = (id: string, toast: Partial<Pick<Toast, 'content' | 'type' | 'auto'>>) => {
        console.log('update', toastList);
        if (!toastListRef.current.length) return;

        const relevantIndex = toastListRef.current.findIndex((toast) => toast.id === id);
        console.log('ting', toastListRef.current, relevantIndex);
        const relevantToast = toastListRef.current[relevantIndex];
        const updatedList = [...toastListRef.current];
        updatedList[relevantIndex] = { ...relevantToast, ...toast };
        setToastList(updatedList);

        if (toast.auto) {
            setTimeout(() => {
                removeToast(id);
            }, 3000);
        }
    };

    const getBgColor = (toastType: ToastType) => {
        switch (toastType) {
            case ToastType.Info:
                return 'beets.base.300';
            case ToastType.Error:
                return 'beets.red';
            case ToastType.Success:
                return 'green.400';
            case ToastType.Warn:
                return 'orange.400';
            default:
                return 'beets.base.300';
        }
    };

    const getTextColor = (toastType: ToastType) => {
        switch (toastType) {
            case ToastType.Info:
                return 'white';
            case ToastType.Error:
                return 'beets.base.900';
            case ToastType.Success:
                return 'beets.base.900';
            case ToastType.Warn:
                return 'beets.base.900';
            default:
                return 'beets.base.900';
        }
    };

    const context = { showToast, removeToast, updateToast, toastList };

    return (
        <BeetsToastContext.Provider value={context}>
            <Portal>
                <AnimatePresence>
                    {toastList.map((toast, i) => (
                        <Box
                            zIndex="toast"
                            key={`toast-${toast.id}`}
                            backgroundColor={getBgColor(toast.type || ToastType.Info)}
                            color={getTextColor(toast.type || ToastType.Info)}
                            position="fixed"
                            p="4"
                            left="0"
                            right="0"
                            bottom="-128px"
                            marginX="auto"
                            width="fit-content"
                            maxW="80%"
                            rounded="lg"
                            shadow="dark-lg"
                            as={motion.div}
                            initial={{ transform: 'translateY(0px)' }}
                            animate={{
                                transform: `translateY(-${148 + i * 84}px)`,
                                transition: { damping: 20, mass: 0.8, stiffness: 200, type: 'spring' },
                            }}
                            exit={{
                                transform: 'translateY(0px)',
                                transition: { damping: 20, mass: 0.8, stiffness: 200, type: 'spring' },
                            }}
                            layout={true}
                        >
                            <HStack>
                                <Box>
                                    <CloseButton onClick={() => removeToast(toast.id)} />
                                </Box>
                                <Box>{toast.content}</Box>
                            </HStack>
                        </Box>
                    ))}
                </AnimatePresence>
            </Portal>
            {children}
        </BeetsToastContext.Provider>
    );
}
