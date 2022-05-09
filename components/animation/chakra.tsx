import { chakra } from '@chakra-ui/system';
import { isValidMotionProp, motion } from 'framer-motion';

export const ChakraBox = chakra(motion.div, {
    shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === 'children',
});
