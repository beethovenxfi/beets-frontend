import { Box } from '@chakra-ui/layout';
import { Portal } from '@chakra-ui/portal';
import { CloseButton, HStack, Spinner, useBreakpointValue } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { sum } from 'lodash';
import React, { ReactNode, useContext, useRef, useState } from 'react';

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
    Loading = 'LOADING',
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
    const containerHeightRef = useRef(0);
    const toastContainerRef = useRef([] as (HTMLDivElement | null)[]);
    const [containerHeight, setContainerHeight] = useState(0);
    const [yPositions, setYPositions] = useState<number[]>([]);
    const isMobile = useBreakpointValue({ base: true, lg: false });

    toastListRef.current = toastList;
    containerHeightRef.current = containerHeight;

    const showToast = (toast: Toast) => {
        if (toastListRef.current.find((_toast) => toast.id === _toast.id)) {
            return;
        }

        toastContainerRef.current = toastContainerRef.current.filter((el) => el !== null);
        const height = sum(toastContainerRef.current.map((el) => el?.offsetHeight || 0));
        setContainerHeight(height);

        setToastList([
            ...toastListRef.current,
            {
                ...toast,
                type: toast.type || ToastType.Info,
            },
        ]);

        yPositions[toastList.length] = 16;
        setYPositions(yPositions);

        if (toast.auto) {
            setTimeout(() => {
                removeToast(toast.id);
            }, 3000);
        }
    };

    const addRef = (i: number, el: HTMLDivElement | null) => {
        toastContainerRef.current[i] = el;
        yPositions[i] = containerHeight + (i + 1) * 16;
        setContainerHeight(containerHeight + (el?.offsetHeight || 0) + 16);
        setYPositions(yPositions);
    };

    function removeToast(id: string) {
        if (!toastListRef.current.length) return;
        let indexOfEl = toastList.findIndex((toast) => toast.id === id);
        let heightOfEl = toastContainerRef.current[indexOfEl]?.offsetHeight || 0;

        setToastList(toastListRef.current.filter((toast) => toast.id !== id));
        setContainerHeight(containerHeightRef.current - heightOfEl);
    }

    const updateToast = (id: string, toast: Partial<Pick<Toast, 'content' | 'type' | 'auto'>>) => {
        if (!toastListRef.current.length) return;

        const relevantIndex = toastListRef.current.findIndex((toast) => toast.id === id);
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
                return 'red.400';
            case ToastType.Success:
                return 'green.400';
            case ToastType.Warn:
                return 'orange.200';
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
                return 'orange.900';
            case ToastType.Loading:
                return 'white';
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
                            ref={(el) => addRef(i, el)}
                            backgroundColor={getBgColor(toast.type || ToastType.Info)}
                            color={getTextColor(toast.type || ToastType.Info)}
                            px="4"
                            py="3"
                            fontWeight="semibold"
                            marginX="auto"
                            width="fit-content"
                            maxW="80%"
                            rounded="lg"
                            shadow="dark-lg"
                            as={motion.div}
                            position="fixed"
                            bottom="0"
                            left="0"
                            right="0"
                            initial={{
                                transform: `translateY(96px)`,
                            }}
                            animate={{
                                transform: `translateY(-${yPositions[i]}px)`,
                                transition: { damping: 20, mass: 0.8, stiffness: 200, type: 'spring' },
                            }}
                            exit={{
                                transform: isMobile ? 'translateY(196px)' : 'translateY(96px)',
                                transition: { damping: 20, mass: 0.8, stiffness: 200, type: 'spring' },
                            }}
                        >
                            <HStack>
                                <Box>
                                    <CloseButton onClick={() => removeToast(toast.id)} />
                                </Box>
                                <Box>{toast.content}</Box>
                                {toast.type === ToastType.Loading && <Spinner size="sm" />}
                            </HStack>
                        </Box>
                    ))}
                </AnimatePresence>
            </Portal>
            {children}
        </BeetsToastContext.Provider>
    );
}
