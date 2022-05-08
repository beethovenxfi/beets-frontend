import { Box, Heading } from '@chakra-ui/layout';
import Card from '../card/Card';

type Props = {};

export default function TokenSelect(props: Props) {
    return (
        <Card
            zIndex="overlay"
            position="absolute"
            top="0"
            
            animate={{ transform: 'translateY(0%)' }}
            initial={{ transform: 'translateY(100%)' }}
            exit={{ transform: 'translateY(100%)' }}
        >
            <Heading>Choose a token</Heading>
        </Card>
    );
}
