import {
    Flex,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
} from '@chakra-ui/react';

export function SliderInput({ ...rest }) {
    return (
        <Flex>
            <NumberInput maxW="75px" mr="1rem" {...rest}>
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
            <Slider flex="1" focusThumbOnChange={false} {...rest}>
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>
            <NumberInput maxW="75px" ml="1rem" value={100 - rest.value} isReadOnly>
                <NumberInputField />
            </NumberInput>
        </Flex>
    );
}
