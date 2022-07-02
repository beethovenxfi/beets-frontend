import { Button } from '@chakra-ui/button';
import { HStack } from '@chakra-ui/layout';

type Preset = {
    label: string;
    value: number;
};
interface Props {
    onPresetSelected: (preset: number) => void;
    presets?: Preset[];
}

const defaultPresets = [
    {
        label: '25%',
        value: 0.25,
    },
    {
        label: '50%',
        value: 0.5,
    },
    {
        label: '75%',
        value: 0.75,
    },
    {
        label: '100%',
        value: 1,
    },
];
export default function PresetSelector({ onPresetSelected, presets = defaultPresets }: Props) {
    const handlePresetSelected = (preset: number) => () => {
        onPresetSelected(preset);
    };
    return (
        <HStack width="full">
            {presets.map((preset) => (
                <Button
                    key={`preset-${preset.label}`}
                    _focus={{ outline: 'none' }}
                    onClick={handlePresetSelected(preset.value)}
                    size="xs"
                    width="full"
                >
                    {preset.label}
                </Button>
            ))}
        </HStack>
    );
}
