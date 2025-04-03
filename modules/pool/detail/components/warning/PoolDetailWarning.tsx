import { Box, HStack, Link } from '@chakra-ui/react';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { useEffect } from 'react';
import { PoolDetailWarning as PoolDetailWarningType } from '~/lib/config/network-config-type';

interface Props {
    warning: PoolDetailWarningType;
}

export function PoolDetailWarning({ warning }: Props) {
    const { showToast } = useToast();

    useEffect(() => {
        showToast({
            id: 'pool-detail-alert',
            type: ToastType.Warn,
            content: (
                <HStack>
                    <Box>
                        {warning.message}{' '}
                        {warning.link && (
                            <Link href={warning.link.url} target="_blank" textDecoration="underline" color="inherit">
                                {warning.link.text}
                            </Link>
                        )}
                    </Box>
                </HStack>
            ),
        });
    }, []);

    return null;
}
