import { Button } from '@chakra-ui/button';
import { Box, Heading, VStack } from '@chakra-ui/layout';
import BeetsButton from '../button/Button';
import Card from '../card/Card';
import BeetsInput from '../inputs/BeetsInput';

type Props = {
    toggle?: any;
};

export default function TokenSelect({ toggle }: Props) {
    return (
        <Card
            shadow="lg"
            title="Choose a token"
            width="full"
            animate={{ scale: 1, opacity: 1 }}
            initial={{ scale: 0.8, height: '400px', opacity: 0, position: 'absolute' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            exit={{ scale: 0.9, opacity: 0 }}
        >
            <VStack padding='4'>
                <BeetsInput placeholder="0x.." type='text' label='Search' />
                <BeetsButton onClick={toggle}>go back</BeetsButton>
            </VStack>
        </Card>
    );
}
