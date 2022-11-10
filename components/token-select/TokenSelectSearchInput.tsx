import { forwardRef, Input, InputGroup, InputLeftElement, useTheme } from '@chakra-ui/react';
import { Search } from 'react-feather';

interface Props {
    placeholder: string;
    value: string;
    setValue: (value: string) => void;
}

export const TokenSelectSearchInput = forwardRef(({ value, setValue, placeholder }: Props, ref) => {
    const { colors } = useTheme();

    return (
        <InputGroup>
            <InputLeftElement pointerEvents="none" height="full">
                <Search color={colors.gray['200']} size={22} style={{ marginBottom: 2 }} />
            </InputLeftElement>
            <Input
                ref={ref}
                variant="filled"
                placeholder={placeholder}
                size="lg"
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
            />
        </InputGroup>
    );
});
