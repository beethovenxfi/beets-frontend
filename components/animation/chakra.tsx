import { chakra } from '@chakra-ui/system';
import { isValidMotionProp, motion } from 'framer-motion';

export const AnimatedBox = chakra(motion.div, {
    shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === 'children',
});