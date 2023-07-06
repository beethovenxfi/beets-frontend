import { AlertTriangle } from 'react-feather';
import { Box, BoxProps, Button, HStack, Heading, VStack, Link, Spacer } from '@chakra-ui/react';
import { ReactNode } from 'react';
import Card from '~/components/card/Card';

interface Props extends BoxProps {
    children: ReactNode | ReactNode[];
    hidden: boolean;
    setHidden: () => void;
    showReadMore?: boolean;
}

export function LgeWarning({ children, hidden, setHidden, showReadMore = true }: Props) {
    return (
        <Box hidden={hidden}>
            <Card p="4" mb="4" bg="orange.200" color="black">
                <VStack>
                    <HStack alignSelf="flex-start">
                        <AlertTriangle />
                        <Heading>Warning</Heading>
                        <AlertTriangle />
                    </HStack>
                    {children}
                    <HStack pt="4" justifyContent="space-between" w="full">
                        {showReadMore ? (
                            <Link href="https://docs.beets.fi/boundless-opportunity/lbp" isExternal>
                                <Button color="black" border="1px">
                                    Read more...
                                </Button>
                            </Link>
                        ) : (
                            <Spacer />
                        )}
                        <Button onClick={setHidden} border="1px">
                            I understand
                        </Button>
                    </HStack>
                </VStack>
            </Card>
        </Box>
    );
}
