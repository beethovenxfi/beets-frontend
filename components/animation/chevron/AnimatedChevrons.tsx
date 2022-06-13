import { Box } from '@chakra-ui/layout';
import { motion } from 'framer-motion';

type Props = {
    delay?: number;
    color?: string;
};

export default function AnimatedChevrons({ delay = 0, color = 'beets.green' }: Props) {
    return (
        <Box color={color}>
            <motion.svg
                transform="scale(1)"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <motion.path
                    d="M7 3L12 8L17 3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        delay: 0.2 + delay,
                        repeat: Infinity,
                        type: 'tween',
                        duration: 1,
                        repeatType: 'reverse',
                    }}
                />
                <motion.path
                    d="M7 10L12 15L17 10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        delay: 0.4 + delay,
                        repeat: Infinity,
                        type: 'tween',
                        duration: 1,
                        repeatType: 'reverse',
                    }}
                />

                <motion.path
                    d="M7 17L12 22L17 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        delay: 0.6 + delay,
                        repeat: Infinity,
                        type: 'tween',
                        duration: 1,
                        repeatType: 'reverse',
                    }}
                />
            </motion.svg>
        </Box>
    );
}
