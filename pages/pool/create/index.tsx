import {
    FormControl,
    FormHelperText,
    FormLabel,
    Grid,
    GridItem,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    ListItem,
    OrderedList,
    Text,
} from '@chakra-ui/react';
import Head from 'next/head';

const PoolCreatePage = () => {
    const TITLE = 'Beethoven X | Compose a Pool';
    return (
        <>
            <Head>
                <title>{TITLE}</title>
                <meta name="title" content={TITLE} />
                <meta property="og:title" content={TITLE} />
                <meta property="twitter:title" content={TITLE} />
            </Head>
            <Text as="h1" textStyle="h1" mb="50px">
                Compose a pool
            </Text>
            <Grid
                templateColumns="200px 1fr 300px"
                templateAreas={`"left name right"
                                "left owner right"
                                "left symbol right"
                                "left fee right"`}
                gap="6"
                w="1024px"
            >
                <GridItem area="left" border="1px" borderRadius="lg" p="10px">
                    <Text as="h2" textStyle="h2" mb="20px">
                        Title Left
                    </Text>
                    <OrderedList>
                        <ListItem>Pool details</ListItem>
                        <ListItem>Tokens & weights</ListItem>
                        <ListItem>??</ListItem>
                        <ListItem>??</ListItem>
                    </OrderedList>
                </GridItem>
                <GridItem area="name">
                    <FormControl>
                        <FormLabel>Pool name</FormLabel>
                        <Input variant="flushed" type="text" />
                        <FormHelperText>The name of the pool.</FormHelperText>
                    </FormControl>
                </GridItem>
                <GridItem area="owner">
                    <FormControl>
                        <FormLabel>Pool Owner</FormLabel>
                        <Input
                            variant="flushed"
                            isReadOnly
                            type="text"
                            value="0xCd983793ADb846dcE4830c22F30C7Ef0C864a776"
                        />
                        <FormHelperText>The owner of the pool.</FormHelperText>
                    </FormControl>
                </GridItem>
                <GridItem area="symbol">
                    <FormControl>
                        <FormLabel>Pool Symbol</FormLabel>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <Text>BPT-</Text>
                            </InputLeftElement>
                            <Input variant="flushed" type="text" />
                        </InputGroup>
                        <FormHelperText>The symbol of the pool.</FormHelperText>
                    </FormControl>
                </GridItem>
                <GridItem area="fee">
                    <FormControl>
                        <FormLabel>Swap fee percentage</FormLabel>
                        <InputGroup>
                            <Input variant="flushed" type="number" />
                            <InputRightElement pointerEvents="none">
                                <Text>%</Text>
                            </InputRightElement>
                        </InputGroup>
                        <FormHelperText>The swap fee percentage of the pool.</FormHelperText>
                    </FormControl>
                </GridItem>
                <GridItem area="right" border="1px" borderRadius="lg" p="10px">
                    <Text as="h2" textStyle="h2" mb="20px">
                        Title Right
                    </Text>
                </GridItem>
            </Grid>
        </>
    );
};

export default PoolCreatePage;
