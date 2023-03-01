import { Box, Button } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

interface SwitchButtonOption {
    id: string;
    label: string;
}
interface Props {
    onChange: (id: string) => void;
    options: SwitchButtonOption[];
    value: string;
}

export default function SwitchButton({ options, onChange, value }: Props) {
    return (
        <Box rounded="md" overflow="hidden" backgroundColor="whiteAlpha.100">
            {options.map((option) => (
                <Button
                    key={`switchbutton-${option.id}`}
                    backgroundColor="transparent"
                    position="relative"
                    onClick={() => onChange(option.id)}
                    _hover={{ backgroundColor: 'none' }}
                    _active={{ backgroundColor: 'none' }}
                    _focus={{ backgroundColor: 'none' }}
                >
                    {option.label}
                    {value === option.id && (
                        <Box
                            as={motion.div}
                            layoutId="active-bg"
                            position="absolute"
                            width="100%"
                            height="100%"
                            background="whiteAlpha.300"
                            rounded="md"
                        />
                    )}
                </Button>
            ))}
        </Box>
    );
}
