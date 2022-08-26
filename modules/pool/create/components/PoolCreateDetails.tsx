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
    Text,
} from '@chakra-ui/react';

export function PoolCreateDetails() {
    return (
        <Grid gap="6">
            <GridItem>
                <FormControl>
                    <FormLabel>Pool name</FormLabel>
                    <Input variant="flushed" type="text" />
                    <FormHelperText>The name of the pool.</FormHelperText>
                </FormControl>
            </GridItem>
            <GridItem>
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
            <GridItem>
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
            <GridItem>
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
        </Grid>
    );
}
