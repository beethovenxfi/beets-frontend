import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';
import { forwardRef } from 'react';

interface Props {
    id: string;
}

export function parse(val: string) {
    return val.replace(/^\%/, '');
}

export function format(val: string) {
    return val + '%';
}

function Input({ id, ...rest }: Props, ref: any) {
    return (
        <NumberInput id={id} {...rest} ref={ref}>
            <NumberInputField />
            <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
            </NumberInputStepper>
        </NumberInput>
    );
}

const PercentageInput = forwardRef(Input);

export default PercentageInput;
