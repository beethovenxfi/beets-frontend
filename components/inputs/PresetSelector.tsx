import { Button } from '@chakra-ui/button';
import { HStack } from '@chakra-ui/layout';

interface Props {
    onPresetSelected: (preset: number) => void;
}
export default function PresetSelector({ onPresetSelected }: Props) {
    const handlePresetSelected = (preset: number) => () => {
        onPresetSelected(preset);
    };
    return (
        <HStack width="full">
            <Button onClick={handlePresetSelected(0.25)} size="xs" width="full">
                25%
            </Button>
            <Button onClick={handlePresetSelected(0.5)} size="xs" width="full">
                50%
            </Button>
            <Button onClick={handlePresetSelected(0.75)} size="xs" width="full">
                75%
            </Button>
            <Button onClick={handlePresetSelected(1)} size="xs" width="full">
                100%
            </Button>
        </HStack>
    );
}
